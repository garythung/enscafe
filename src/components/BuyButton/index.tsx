import { useState } from "react";
import { useSigner } from "wagmi";
import { buyToken } from "@reservoir0x/client-sdk";

import Button from "~/components/Button";
import useWallet from "~/hooks/useWallet";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import { useContractAddress } from "~/hooks/useContractAddress";
import { useReservoir } from "~/hooks/useReservoir";

type Props = {
  tokenId: string;
  onSuccess: () => void;
  amount: string;
};

export default function BuyButton({ tokenId, onSuccess, amount }: Props) {
  const { account } = useWallet();
  const { addToast, addTxMiningToast } = useToast();
  const [isMining, setIsMining] = useState(false);
  const { data: signer } = useSigner();
  const ensAddr = useContractAddress("ens");
  const { apiBase } = useReservoir();

  const test = () => {
    addTxMiningToast("abc");
    addToast({
      content: (
        <span className="flex items-center">
          bought for bought for bought for bought for
          <EthIcon className="inline-block w-2 ml-1 mr-1" />
          <span className="font-mono">1</span>!
        </span>
      ),
      variant: "success",
    });
  };

  const onClick = async () => {
    setIsMining(true);
    await buyToken({
      query: {
        token: `${ensAddr}:${tokenId}`,
        taker: account,
      },
      signer,
      apiBase,
      setState: () => {},
      handleError: (error) => {
        setIsMining(false);
        addToast({
          content: <span>{error.message}</span>,
          variant: "danger",
        });
      },
      handleSuccess: () => {
        setIsMining(false);
        onSuccess();

        addToast({
          content: (
            <span className="flex items-center">
              bought for
              <EthIcon className="inline-block w-2 ml-1 mr-1" />
              <span className="font-mono">{amount}</span>!
            </span>
          ),
          variant: "success",
        });
      },
      handleTxHash: (hash) => {
        addTxMiningToast(hash);
      },
    });
  };

  return (
    <>
      {/* <button onClick={test}>test</button> */}
      <Button fluid variant="primary" onClick={onClick} loading={isMining}>
        buy now
      </Button>
    </>
  );
}
