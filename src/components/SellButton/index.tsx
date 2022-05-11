import { useState } from "react";
import Button from "~/components/Button";
import { useSigner } from "wagmi";
import { acceptOffer } from "@reservoir0x/client-sdk";

import useWallet from "~/hooks/useWallet";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import { useReservoir } from "~/hooks/useReservoir";
import { useContractAddress } from "~/hooks/useContractAddress";

type Props = {
  tokenId: string;
  onSuccess: () => void;
  amount: string;
};

export default function SellButton({ tokenId, onSuccess, amount }: Props) {
  const { account } = useWallet();
  const { addToast } = useToast();
  const [isMining, setIsMining] = useState(false);
  const { data: signer } = useSigner();
  const ensAddr = useContractAddress("ens");
  const { apiBase } = useReservoir();

  const onClick = async () => {
    setIsMining(true);
    await acceptOffer({
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
              sold for
              <EthIcon className="inline-block w-2 ml-1 mr-1" />
              <span className="font-mono tracking-tighter">{amount}</span>!
            </span>
          ),
          variant: "success",
        });
      },
    });
  };

  return (
    <Button fluid variant="primary" onClick={onClick} loading={isMining}>
      sell now for
      <span className="flex items-center gap-1 ml-1.5">
        <EthIcon className="inline-block w-2" />
        <span className="font-mono tracking-tighter">{amount}</span>
      </span>
    </Button>
  );
}
