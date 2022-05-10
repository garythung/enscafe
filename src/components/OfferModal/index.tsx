import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import DatePicker from "react-datepicker";
import { Contract, ethers } from "ethers";
import CurrencyInput from "react-currency-input-field";
import { useSigner } from "wagmi";
import { placeBid } from "@reservoir0x/client-sdk";
import * as Yup from "yup";

import Button from "~/components/Button";
import RadioButton from "~/components/RadioButton";
import useWallet from "~/hooks/useWallet";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import ERC20ABI from "~/abis/ERC20.json";
import Modal from "~/components/Modal";
import { useContractAddress } from "~/hooks/useContractAddress";
import { useReservoir } from "~/hooks/useReservoir";

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

const getExpiration = (expiration: string, customExpiration: Date): number => {
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

const OfferSchema = Yup.object().shape({
  amount: Yup.string().min(1).required("Required!"),
});

export default function OfferModal({
  isOpen,
  onClose,
  tokenId,
  ens,
  onSuccess,
}: Props) {
  const { account } = useWallet();
  const { addToast, addTxMiningToast } = useToast();
  const [wethAllowance, setWethAllowance] = useState(ethers.BigNumber.from(0));
  const [isMining, setIsMining] = useState(false);
  const { data: signer } = useSigner();
  const wyvernTokenTransferProxyAddr = useContractAddress(
    "wyvernTokenTransferProxy",
  );
  const wethAddr = useContractAddress("weth");
  const wethContract = new Contract(wethAddr, ERC20ABI);
  const ensAddr = useContractAddress("ens");
  const { apiBase } = useReservoir();

  // check weth allowance
  useEffect(() => {
    const fetch = async () => {
      if (!account || !isOpen) {
        return;
      }

      const allowance = await wethContract
        .connect(signer)
        .allowance(account, wyvernTokenTransferProxyAddr);
      setWethAllowance(allowance);
    };

    fetch();
  }, [account, isOpen]);

  const closeHandler = () => {
    onClose();
  };

  const handleWethAllowance = async () => {
    try {
      setIsMining(true);
      const { wait, hash } = await wethContract
        .connect(signer)
        .approve(
          wyvernTokenTransferProxyAddr,
          ethers.constants.MaxUint256.toString(),
        );

      addTxMiningToast(hash);
      await wait();
      addToast({
        content: <span>max weth allowance granted to opensea</span>,
        variant: "success",
      });
      setIsMining(false);
      setWethAllowance(ethers.constants.MaxUint256);
    } catch (error) {
      setIsMining(false);
      addToast({
        content: <span>something went wrong, try again</span>,
        variant: "danger",
      });
    }
  };

  const onSubmit = async (values: Values) => {
    setIsMining(true);
    await placeBid({
      query: {
        orderbook: "reservoir",
        orderKind: "wyvern-v2.3",
        maker: account,
        weiPrice: ethers.utils.parseEther(values.amount).toString(),
        expirationTime: getExpiration(
          values.expiration,
          values.customExpiration,
        ).toString(),
        token: `${ensAddr}:${tokenId}`,
      },
      signer,
      apiBase,
      setState: () => {},
      handleError: (error) => {
        setIsMining(false);
        addToast({
          content: <span>something went wrong, try again</span>,
          variant: "danger",
        });
      },
      handleSuccess: () => {
        setIsMining(false);
        onSuccess();
        addToast({
          content: (
            <span className="flex items-center">
              offered
              <EthIcon className="inline-block w-2 ml-1 mr-1" />
              <span className="font-mono tracking-tighter">
                {values.amount}
              </span>
            </span>
          ),
          variant: "success",
        });
        onClose();
      },
    });
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
          validationSchema={OfferSchema}
        >
          {({ errors, handleChange, setFieldError, values, setFieldValue }) => (
            <Form className="w-full flex flex-col self-center h-4/5 px-6 pt-12 pb-8 gap-y-4">
              <h1 className="text-3xl font-bold font-pressura">{ens}</h1>
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
                <Button variant="primary" loading={isMining} type="submit">
                  send offer
                </Button>
              )}
              {!wethAllowance.eq(ethers.constants.MaxUint256) && (
                <Button
                  variant="primary"
                  loading={isMining}
                  onClick={handleWethAllowance}
                >
                  let opensea use your WETH
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
