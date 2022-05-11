import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Interface } from "ethers/lib/utils";
import { Form, Formik } from "formik";
import CurrencyInput from "react-currency-input-field";
import { Contract, ethers } from "ethers";
import * as Yup from "yup";
import { useSigner } from "wagmi";
import { listToken } from "@reservoir0x/client-sdk";

import Button from "~/components/Button";
import RadioButton from "~/components/RadioButton";
import useWallet from "~/hooks/useWallet";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import Modal from "~/components/Modal";
import ENSRegistrarABI from "~/abis/ENSRegistrar.json";
import WyvernProxyRegistryABI from "~/abis/WyvernProxyRegistry.json";
import { useContractAddress } from "~/hooks/useContractAddress";
import { useReservoir } from "~/hooks/useReservoir";
import { InformationCircleIcon } from "@heroicons/react/outline";

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

const ListingSchema = Yup.object().shape({
  amount: Yup.string().min(1).required("Required!"),
});

export default function ListModal({
  isOpen,
  onClose,
  tokenId,
  ens,
  currentPrice,
  onSuccess,
}: Props) {
  const ensContractAddress = useContractAddress("ens");
  const ensContract = new Contract(ensContractAddress, ENSRegistrarABI);
  const wyvernProxyRegistryAddr = useContractAddress("wyvernProxyRegistry");
  const proxyRegistryContract = new Contract(
    wyvernProxyRegistryAddr,
    WyvernProxyRegistryABI,
  );
  const { account } = useWallet();
  const { addToast, addTxMiningToast } = useToast();
  const [userProxy, setUserProxy] = useState(ethers.constants.AddressZero);
  const [ensTransfersApproved, setEnsTransfersApproved] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const { data: signer } = useSigner();
  const ensAddr = useContractAddress("ens");
  const { apiBase } = useReservoir();

  // check proxy status and transfer approval
  useEffect(() => {
    const fetch = async () => {
      if (!account || !isOpen) {
        return;
      }

      const userProxy = await proxyRegistryContract
        .connect(signer)
        .proxies(account);
      setUserProxy(userProxy);

      if (userProxy !== ethers.constants.AddressZero) {
        const isApproved = await ensContract
          .connect(signer)
          .isApprovedForAll(account, userProxy);
        setEnsTransfersApproved(isApproved);
      }
    };
    fetch();
  }, [account, isOpen]);

  const closeHandler = () => {
    onClose();
  };

  const handleRegisterProxy = async () => {
    try {
      setIsMining(true);
      const { wait, hash } = await proxyRegistryContract
        .connect(signer)
        .registerProxy();
      addTxMiningToast(hash);
      await wait();
      addToast({
        content: <span>proxy registered with opensea</span>,
        variant: "success",
      });
      const userProxy = await proxyRegistryContract
        .connect(signer)
        .proxies(account);
      setIsMining(false);
      setUserProxy(userProxy);
    } catch (error) {
      setIsMining(false);
      addToast({
        content: <span>something went wrong, try again</span>,
        variant: "danger",
      });
    }
  };

  const handleApproveNFTTransfers = async () => {
    try {
      setIsMining(true);
      const { wait, hash } = await ensContract
        .connect(signer)
        .setApprovalForAll(userProxy, true);
      addTxMiningToast(hash);
      await wait();
      setIsMining(false);
      setEnsTransfersApproved(true);
      addToast({
        content: <span>ens transfers approved for opensea</span>,
        variant: "success",
      });
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
    await listToken({
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
        source: "ens cafe",
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
              {currentPrice ? "lowered price to" : "listed for"}
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
          validationSchema={ListingSchema}
        >
          {({ errors, setFieldError, values, setFieldValue }) => (
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
              {userProxy !== ethers.constants.AddressZero &&
                ensTransfersApproved && (
                  <Button variant="primary" loading={isMining} type="submit">
                    {currentPrice ? "lower price" : "list for sale"}
                  </Button>
                )}
              {userProxy === ethers.constants.AddressZero && (
                <div className="flex flex-col">
                  <Button
                    variant="primary"
                    loading={isMining}
                    onClick={handleRegisterProxy}
                  >
                    register opensea proxy
                  </Button>
                  <span className="flex items-center text-xs mt-1">
                    <InformationCircleIcon className="h-4 w-4 heroicon-sw-2 mr-1" />
                    wyvern is opensea's exchange contract
                  </span>
                </div>
              )}
              {userProxy !== ethers.constants.AddressZero &&
                !ensTransfersApproved && (
                  <div className="flex flex-col">
                    <Button
                      variant="primary"
                      loading={isMining}
                      onClick={handleApproveNFTTransfers}
                    >
                      let wyvern transfer your ens's
                    </Button>
                    <span className="flex items-center text-xs mt-1">
                      <InformationCircleIcon className="h-4 w-4 heroicon-sw-2 mr-1" />
                      wyvern is opensea's exchange contract
                    </span>
                  </div>
                )}
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
