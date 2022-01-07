import { ethers } from "ethers";
import { useState } from "react";
import { WyvernV2 } from "@reservoir0x/sdk";

import Button from "~/components/Button";
import useWallet from "~/hooks/useWallet";
import api from "~/utils/api";
import { getIndexer } from "~/utils/indexers";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import { getChainId } from "~/utils/networks";

type Props = {
  tokenId: string;
  ens: string;
  orderHash: string;
  onSuccess: () => void;
  amount: string;
};

export default function SellButton({
  tokenId,
  ens,
  orderHash,
  onSuccess,
  amount,
}: Props) {
  const { account } = useWallet();
  const { addToast, addTxMiningToast } = useToast();
  const [isMining, setIsMining] = useState(false);

  const onClick = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const buyOrderResponse = await api.get(
      `${getIndexer()}/orders?side=buy&hash=${orderHash}`,
    );
    const buyOrder = new WyvernV2.Order(
      getChainId(),
      buyOrderResponse.data.orders[0].rawData,
    );
    const takerSellOrder = buyOrder.buildMatching(account);
    const exchange = new WyvernV2.Exchange(getChainId());

    try {
      setIsMining(true);
      const { wait, hash } = await exchange.match(
        provider.getSigner() as any,
        buyOrder,
        takerSellOrder,
      );

      addTxMiningToast(hash);
      await wait();
      onSuccess();
      setIsMining(false);

      addToast({
        content: (
          <span className="flex items-center">
            sold for
            <EthIcon className="inline-block w-2 ml-1 mr-1" />
            <span className="font-mono tracking-tighter">
              {ethers.utils.formatUnits(
                buyOrderResponse.data.orders[0].rawData.basePrice,
              )}
            </span>
          </span>
        ),
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

  return (
    <>
      <Button fluid variant="primary" onClick={onClick} loading={isMining}>
        sell now for
        <span className="flex items-center gap-1 ml-1.5">
          <EthIcon className="inline-block w-2" />
          <span className="font-mono tracking-tighter">{amount}</span>
        </span>
      </Button>
    </>
  );
}
