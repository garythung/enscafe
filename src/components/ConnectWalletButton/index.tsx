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
                <div style={{ display: "flex", gap: 12 }}>
                  <Button onClick={openChainModal} variant="secondary">
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name.toLowerCase()}
                  </Button>

                  <Button onClick={openAccountModal} variant="primary">
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
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
