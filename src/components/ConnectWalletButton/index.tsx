import { UserCircleIcon, UserIcon } from "@heroicons/react/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import Button from "~/components/Button";

export default function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button onClick={openConnectModal} fluid>
                    connect wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    wrong network
                  </button>
                );
              }

              return (
                <>
                  <div className="flex gap-3 md:hidden">
                    <Button onClick={openChainModal} variant="secondary-black">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            borderRadius: 999,
                          }}
                          className="h-7 w-7 overflow-hidden"
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="h-7 w-7"
                            />
                          )}
                        </div>
                      )}
                    </Button>

                    <Button onClick={openAccountModal} variant="secondary">
                      <UserCircleIcon className="h-7 w-7 heroicon-sw-1" />
                    </Button>
                  </div>
                  <div className="hidden gap-3 md:flex">
                    <Button onClick={openChainModal} variant="secondary-black">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            borderRadius: 999,
                          }}
                          className="h-4 w-4 mr-1.5 overflow-hidden"
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="h-4 w-4"
                            />
                          )}
                        </div>
                      )}
                      {chain.name.toLowerCase()}
                    </Button>

                    <Button onClick={openAccountModal} variant="secondary">
                      {account.ensName ? (
                        <span className="font-pressura tracking-tighter font-semibold mr-1">
                          {account.ensName}
                        </span>
                      ) : (
                        <span className="mr-1">{account.displayName}</span>
                      )}
                      {account.displayBalance
                        ? `(${account.displayBalance})`
                        : ""}
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
