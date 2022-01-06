import { UnsupportedChainIdError } from "@web3-react/core";

import TextButton from "~/components/TextButton";
import { truncateEth } from "~/utils";
import useWallet from "~/hooks/useWallet";
import Button from "~/components/Button";
import useENSName from "~/hooks/useENSName";
import { shortenAddress } from "~/utils/addresses";
import EthIcon from "~/components/EthIcon";

export default function Wallet() {
  const { account, activate, active, deactivate, error, balance } = useWallet();
  const ensName = useENSName(account);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <p className="text-red-500 font-bold">
        please use {process.env.NEXT_PUBLIC_NETWORK}
      </p>
    );
  }

  if (!active) {
    return <Button onClick={activate}>connect</Button>;
  }

  return (
    <div className="flex flex-col">
      <TextButton onClick={deactivate}>
        {ensName && <span className="font-pressura">{ensName}</span>}
        {!ensName && shortenAddress(account)}
      </TextButton>
      <span className="flex items-center gap-1.5 self-end">
        <span className="font-mono tracking-tighter">
          {balance ? truncateEth(balance) : "0"}
        </span>
        <EthIcon className="inline-block w-3" />
      </span>
    </div>
  );
}
