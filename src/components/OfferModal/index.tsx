import { useEffect, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import DatePicker from "react-datepicker";
import { WyvernV2 } from "@reservoir0x/sdk";
import { Contract, ethers } from "ethers";
import CurrencyInput from "react-currency-input-field";

import Button from "~/components/Button";
import RadioButton from "~/components/RadioButton";
import { getContract } from "~/utils/contracts";
import useWallet from "~/hooks/useWallet";
import api from "~/utils/api";
import { getChainId } from "~/utils/networks";
import { getIndexer } from "~/utils/indexers";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import ERC20 from "~/abis/ERC20.json";
import Modal from "~/components/Modal";

type Props = {
  isOpen: boolean;
  onClose(): void;
  tokenId: string;
  ens: string;
  currentPrice?: string;
  onSuccess: () => void;
};

type Values = {
  amount: string;
  expiration: string;
  customExpiration: Date;
};

const getExpiration = (expiration: string, customExpiration: Date) => {
  if (expiration === "1 hour") {
    return Math.floor(Date.now() / 1000) + 60 * 60;
  }

  if (expiration === "1 day") {
    return Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  }

  if (expiration === "1 week") {
    return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  }

  return Math.floor(customExpiration.valueOf() / 1000);
};

export default function OfferModal({
  isOpen,
  onClose,
  tokenId,
  ens,
  onSuccess,
}: Props) {
  const wethContract = new Contract(getContract("weth"), ERC20);
  const { account } = useWallet();
  const { addToast } = useToast();
  const [wethAllowance, setWethAllowance] = useState(ethers.BigNumber.from(0));
  const [mining, setMining] = useState(false);

  // check weth allowance
  useEffect(() => {
    const fetch = async () => {
      if (!account || !isOpen) {
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const allowance = await wethContract
        .connect(provider.getSigner())
        .allowance(account, getContract("openseaTokenTransferProxy"));
      setWethAllowance(allowance);
    };

    fetch();
  }, [account, isOpen]);

  const closeHandler = () => {
    onClose();
  };

  const handleWethAllowance = async () => {
    try {
      setMining(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { wait } = await wethContract
        .connect(provider.getSigner())
        .approve(
          getContract("openseaTokenTransferProxy"),
          ethers.constants.MaxUint256.toString(),
        );
      await wait();
      addToast(<span>max weth allowance granted to opensea</span>, "success");
      setMining(false);
      setWethAllowance(ethers.constants.MaxUint256);
    } catch (error) {
      setMining(false);
      addToast(<span>something went wrong, try again</span>, "danger");
    }
  };

  const onSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>,
  ) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // construct order params
    const buyOrderParams = {
      contract: getContract("ens"),
      maker: account,
      tokenId: tokenId,
      side: "buy",
      price: ethers.utils.parseEther(values.amount).toString(),
      expirationTime: getExpiration(values.expiration, values.customExpiration),
      fee: "0",
      feeRecipient: account,
    };

    // get formatted params
    const response = await api.get(
      `${getIndexer()}/orders/build?${Object.keys(buyOrderParams)
        .map((key) => key + "=" + buyOrderParams[key])
        .join("&")}`,
    );

    // create sell order
    const sellOrder = new WyvernV2.Order(
      getChainId(),
      response.data.order.params,
    );

    try {
      setMining(true);
      // sign order
      await sellOrder.sign(provider.getSigner());

      // post order to Reservoir
      await api.post(`${getIndexer()}/orders`, {
        orders: [
          {
            kind: "wyvern-v2",
            data: sellOrder.params,
          },
        ],
      });
      setMining(false);
      onSuccess();

      addToast(
        <span className="flex items-center">
          offered
          <EthIcon className="inline-block w-2 ml-1 mr-0.5" />
          <span className="font-mono tracking-tighter">{values.amount}</span>
        </span>,
        "success",
      );
      onClose();
    } catch (error) {
      setMining(false);
      addToast(<span>something went wrong, try again</span>, "danger");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <div className="flex flex-col w-full">
        <Formik
          initialValues={{
            amount: "",
            expiration: "1 hour",
            customExpiration: new Date(Date.now() + 1000 * 60 * 30),
          }}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ errors, handleChange, setFieldError, values, setFieldValue }) => (
            <Form className="w-full flex flex-col self-center h-4/5 px-6 pt-12 pb-8 gap-y-4">
              <h1 className="text-3xl font-medium tracking-tight font-pressura">
                {ens}
              </h1>
              <div className="flex flex-col border-1 border-black py-2.5 px-3 gap-y-2.5">
                <label
                  className={`text-sm text-gray-500 font-medium ${
                    errors.amount ? "text-red-500" : ""
                  }`}
                  htmlFor="amount"
                >
                  amount
                </label>
                <div className="flex flex-row gap-4">
                  <EthIcon className="inline-block w-5" />
                  <CurrencyInput
                    disableGroupSeparators
                    name="amount"
                    id="amount"
                    value={values.amount}
                    onValueChange={(v) => {
                      setFieldError("amount", undefined);
                      setFieldValue("amount", v);
                    }}
                    className={`text-right text-xl border-black font-medium w-full font-mono ${
                      errors.amount ? "border-red-500" : ""
                    }`}
                    placeholder="0.0"
                    allowNegativeValue={false}
                    decimalsLimit={18}
                  />
                </div>
              </div>
              <div className="flex flex-col border-1 border-black py-2.5 px-3 gap-y-2.5">
                <label
                  className={`text-sm text-gray-500 font-medium ${
                    errors.expiration ? "text-red-500" : ""
                  }`}
                  htmlFor="expiration"
                >
                  expiration
                </label>
                <div className="flex justify-between">
                  <RadioButton
                    checked={values.expiration === "1 hour"}
                    onClick={() => {
                      setFieldValue("expiration", "1 hour");
                    }}
                  >
                    1 hour
                  </RadioButton>
                  <RadioButton
                    checked={values.expiration === "1 day"}
                    onClick={() => {
                      setFieldValue("expiration", "1 day");
                    }}
                  >
                    1 day
                  </RadioButton>
                  <RadioButton
                    checked={values.expiration === "1 week"}
                    onClick={() => {
                      setFieldValue("expiration", "1 week");
                    }}
                  >
                    1 week
                  </RadioButton>
                  <RadioButton
                    checked={values.expiration === "custom"}
                    onClick={() => {
                      setFieldValue("expiration", "custom");
                    }}
                  >
                    custom
                  </RadioButton>
                </div>
                {values.expiration === "custom" && (
                  <div>
                    <DatePicker
                      showTimeSelect
                      selected={values.customExpiration}
                      onChange={(d) => {
                        setFieldValue("customExpiration", d);
                      }}
                      dateFormat="M/d/yyyy, h:mm aa"
                      popperClassName="font-sans"
                      filterTime={(time) =>
                        new Date(time).getTime() > Date.now()
                      }
                      filterDate={(d) =>
                        new Date(d.toDateString()) >=
                        new Date(new Date().toDateString())
                      }
                      className="font-mono border-b-1 border-black"
                    />
                  </div>
                )}
              </div>
              {wethAllowance.eq(ethers.constants.MaxUint256) && (
                <Button variant="primary" loading={mining} type="submit">
                  send offer
                </Button>
              )}
              {!wethAllowance.eq(ethers.constants.MaxUint256) && (
                <Button
                  variant="primary"
                  loading={mining}
                  onClick={handleWethAllowance}
                >
                  let opensea use your weth
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
