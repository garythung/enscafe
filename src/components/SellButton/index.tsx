import { ethers } from "ethers";

import Button from "~/components/Button";

import useWallet from "~/hooks/useWallet";
import api from "~/utils/api";
import { getIndexer } from "~/utils/indexers";
import { useToast } from "~/contexts/ToastContext";
import EthIcon from "~/components/EthIcon";
import { WyvernV2 } from "@reservoir0x/sdk";
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
  const { addToast } = useToast();

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
    const { wait } = await exchange.match(
      provider.getSigner() as any,
      buyOrder,
      takerSellOrder,
    );

    await wait();
    onSuccess();

    addToast(
      <span className="flex items-center">
        sold for
        <EthIcon className="inline-block w-2 ml-1 mr-0.5" />
        <span className="font-mono tracking-tighter">
          {ethers.utils.formatUnits(
            buyOrderResponse.data.orders[0].rawData.basePrice,
          )}
        </span>
      </span>,
      "success",
    );
  };

  return (
    <>
      <Button fluid variant="primary" onClick={onClick}>
        sell now for
        <span className="flex items-center gap-0.5 ml-1">
          <EthIcon className="inline-block w-2" />
          <span className="font-mono tracking-tighter">{amount}</span>
        </span>
      </Button>
    </>
  );
}
