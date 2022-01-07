import { ethers } from "ethers";
import { WyvernV2 } from "@reservoir0x/sdk";

import Button from "~/components/Button";
import useWallet from "~/hooks/useWallet";
import api from "~/utils/api";
import { getIndexer } from "~/utils/indexers";
import { useToast } from "~/contexts/ToastContext";
import { getChainId } from "~/utils/networks";
import EthIcon from "~/components/EthIcon";

type Props = {
  tokenId: string;
  ens: string;
  orderHash: string;
  onSuccess: () => void;
};

export default function BuyButton({
  tokenId,
  ens,
  orderHash,
  onSuccess,
}: Props) {
  const { account } = useWallet();
  const { addToast } = useToast();

  const onClick = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const sellOrderResponse = await api.get(
      `${getIndexer()}/orders?side=sell&hash=${orderHash}`,
    );

    const sellOrder = new WyvernV2.Order(
      getChainId(),
      sellOrderResponse.data.orders[0].rawData,
    );

    const takerBuyOrder = sellOrder.buildMatching(account);
    const exchange = new WyvernV2.Exchange(getChainId());
    const { wait } = await exchange.match(
      provider.getSigner() as any,
      takerBuyOrder,
      sellOrder,
    );

    await wait();
    onSuccess();

    addToast(
      <span className="flex items-center">
        bought for
        <EthIcon className="inline-block w-2 ml-1 mr-1" />
        <span className="font-mono tracking-tighter">
          {ethers.utils.formatUnits(
            sellOrderResponse.data.orders[0].rawData.basePrice,
          )}
        </span>
      </span>,
      "success",
    );
  };

  return (
    <>
      <Button fluid variant="primary" onClick={onClick}>
        buy now
      </Button>
    </>
  );
}
