import { validate } from "@ensdomains/ens-validation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useEnsName, useSigner } from "wagmi";
import { normalize } from "@ensdomains/eth-ens-namehash";
import { acceptOffer, cancelOrder } from "@reservoir0x/client-sdk";

import { useGetter } from "~/utils/api";
import { getTokenIdFromName } from "~/utils/ens";
import Layout from "~/layouts/Layout";
import WordArt from "~/components/WordArt";
import LinkButton from "~/components/LinkButton";
import useWallet from "~/hooks/useWallet";
import Button from "~/components/Button";
import BuyButton from "~/components/BuyButton";
import Card from "~/components/Card";
import EthIcon from "~/components/EthIcon";
import OfferButton from "~/components/OfferButton";
import SellButton from "~/components/SellButton";
import ListButton from "~/components/ListButton";
import { useToast } from "~/contexts/ToastContext";
import { formatDateHuman, formatDateTimeHuman } from "~/utils/dates";
import { simplifyAddress, isAddress } from "~/utils/addresses";
import ConnectWalletButton from "~/components/ConnectWalletButton";
import { useContractAddress } from "~/hooks/useContractAddress";
import { useReservoir } from "~/hooks/useReservoir";
import { useENS } from "~/hooks/useENS";
import { getMarketIcon } from "~/utils/markets";

type Status = "redirecting" | "ready";

// copied from ENS Metadata Service
// https://github.com/ensdomains/ens-metadata-service
const isASCII = (str) => /^[ -~]+$/.test(decodeURI(str));

const Container = ({
  ens,
  children,
}: {
  ens: string;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center mt-8 md:w-128 md:mx-auto">
    <Head>
      <title key="title">ens cafe | {ens}</title>
      <meta property="og:title" content={ens} />
    </Head>
    <WordArt text={ens} />
    {children}
  </div>
);

const Offer = ({ order, owner, onAcceptSuccess, onCancelSuccess }) => {
  const { account, active } = useWallet();
  const { addToast } = useToast();
  const { data: ensName } = useEnsName({ address: order.maker || "" });
  const isMaker = active && account && account === isAddress(order.maker);
  const isOwner = active && account && account === isAddress(owner);
  const hasExpiration = order.validUntil !== 0;
  const validUntilDate = new Date(order.validUntil * 1000);
  const [isMining, setIsMining] = useState(false);
  const { data: signer } = useSigner();
  const { apiBase } = useReservoir();

  const handleAccept = async (order: any) => {
    setIsMining(true);
    await acceptOffer({
      query: {
        token: order.tokenSetId.replace("token:", ""),
        taker: account,
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
        onAcceptSuccess();

        addToast({
          content: (
            <span className="flex items-center">
              sold for
              <EthIcon className="inline-block w-2 ml-1 mr-1" />
              <span className="font-mono tracking-tighter">{order.price}</span>!
            </span>
          ),
          variant: "success",
        });
      },
    });
  };

  const handleCancel = async (order: any) => {
    setIsMining(true);
    await cancelOrder({
      query: {
        id: order.id,
        maker: account,
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
        onCancelSuccess();

        addToast({
          content: <span className="flex items-center">canceled offer</span>,
          variant: "success",
        });
      },
    });
  };

  return (
    <tr className="border-b-1 border-gray-300">
      <td className="py-2">{simplifyAddress(order.maker, account, ensName)}</td>
      <td
        className="py-2"
        title={hasExpiration ? validUntilDate.toLocaleString() : undefined}
      >
        {hasExpiration && validUntilDate.toLocaleDateString()}
      </td>
      <td className="py-2">
        <div className="flex items-center gap-x-1">
          <EthIcon className="inline-block w-2" />{" "}
          <span className="font-mono tracking-tighter">{order.value}</span>
        </div>
      </td>
      <td className="py-2 flex justify-end">
        {isMaker && (
          <Button
            onClick={() => handleCancel(order)}
            variant="pill-secondary"
            loading={isMining}
          >
            cancel
          </Button>
        )}
        {isOwner && (
          <Button
            onClick={() => handleAccept(order)}
            variant="pill-secondary"
            loading={isMining}
          >
            accept
          </Button>
        )}
      </td>
    </tr>
  );
};

// removes expired orders
const filterBuyOrders = (orders): [any] => {
  return orders.filter((o) => {
    if (o.validUntil === 0) {
      return true;
    }

    return o.validUntil > Date.now() / 1000;
  });
};

// get ENS name expiration date in unix timestamp milliseconds
const getExpiration = (metadata: any): number => {
  return metadata.attributes.find((a) => a.trait_type === "Expiration Date")
    .value;
};

export default function Name() {
  const { account, active } = useWallet();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState<Status>("redirecting");
  const { metadataUrl } = useENS();
  const ens = (router.query.name as string) || ""; // has .eth ending
  const ensWithoutTLD = ens ? ens.slice(0, ens.length - 4) : "";
  const isLongEnough = ensWithoutTLD.length >= 3;
  const isValid = isLongEnough && validate(ensWithoutTLD);
  const ensAddr = useContractAddress("ens");
  const { apiBase } = useReservoir();

  const { data: tokenData, mutate: mutateTokenData } = useGetter(
    `${apiBase}/tokens/details/v4?tokens=${ensAddr}:${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}&sortBy=floorAskPrice&limit=20`,
    status === "ready" && !!ens && !!ensWithoutTLD,
  );
  const { data: ownerData, mutate: mutateOwnerData } = useGetter(
    `${apiBase}/owners/v1?token=${ensAddr}:${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}&offset=0&limit=20`,
    status === "ready" &&
      !!tokenData?.tokens.length &&
      !!ens &&
      !!ensWithoutTLD,
  );
  const { data: buyOrdersData, mutate: mutateBuyOrdersData } = useGetter(
    `${apiBase}/orders/bids/v1?token=${ensAddr}:${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}&sortBy=price&limit=50`,
    status === "ready" &&
      !!tokenData?.tokens.length &&
      !!ens &&
      !!ensWithoutTLD,
  );
  const { data: metadata, mutate: mutateMetadata } = useGetter(
    `${metadataUrl}/${ensAddr}/${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}`,
    status === "ready" &&
      !!tokenData?.tokens.length &&
      !!ens &&
      !!ensWithoutTLD,
  );

  // conveniences
  const token = tokenData?.tokens[0];
  const owner = isAddress(ownerData?.owners[0].address);
  const buyOrders = buyOrdersData?.orders || [];
  const { data: ownerENSName } = useEnsName({
    address: owner || "",
  });

  useEffect(() => {
    if (!ens) {
      return;
    }

    // route to .eth ending
    if (ens.slice(ens.length - 4) !== ".eth") {
      router.push(`/names/${normalize(ens)}.eth`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/names/${normalize(ens)}`, undefined, {
        shallow: true,
      });
    }

    setStatus("ready");
  }, [ens]);

  useEffect(() => {
    setIsOwner(owner === account);
  }, [account, owner]);

  if (!tokenData) {
    return <Container ens={ens} />;
  }

  if (!isValid) {
    return (
      <Container ens={ens}>
        {!isLongEnough && (
          <div className="w-full mt-4">
            <Card>
              <p>
                <span className="mr-3">❌</span>Names must be at least 3
                characters long.
              </p>
            </Card>
          </div>
        )}

        {!validate(ensWithoutTLD) && (
          <div className="w-full mt-4">
            <Card>
              <p>
                <span className="mr-3">❌</span>This name contains invalid
                characters.
              </p>
            </Card>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container ens={ens}>
      {metadata && (
        <div className="flex w-full items-center justify-between mt-4">
          <Card>
            <p title={new Date(getExpiration(metadata)).toString()}>
              <span className="mr-3">⏳</span>this name expires on{" "}
              {formatDateHuman(new Date(getExpiration(metadata)))}
            </p>
          </Card>
        </div>
      )}

      {!isASCII(ensWithoutTLD) && (
        <div className="w-full mt-4">
          <Card>
            <p>
              <span className="mr-3">🚨</span>ATTENTION: This name contains
              non-ASCII characters as shown above. Please be aware that there
              are characters that look identical or very similar to English
              letters, especially characters from Cyrillic and Greek. Also,
              traditional Chinese characters can look identical or very similar
              to simplified variants.{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/IDN_homograph_attack"
                className="font-semibold"
              >
                See here for more information.
              </a>
            </p>
          </Card>
        </div>
      )}

      {status === "ready" && !token && (
        <div className="flex flex-col gap-4 w-full mt-4">
          <Card>
            <p>
              <span className="mr-3">✋</span>
              <span className="font-semibold font-pressura">{ens}</span> is not
              registered yet. Get it now!
            </p>
          </Card>
          <LinkButton
            fluid
            target="_blank"
            rel="noopener noreferrer"
            href={`https://app.ens.domains/name/${ens}`}
          >
            register
          </LinkButton>
        </div>
      )}

      {/* INFO */}
      {owner && (
        <div className="flex w-full mt-4">
          <p>owned by {simplifyAddress(owner, account, ownerENSName)}</p>
        </div>
      )}

      {token?.market?.floorAsk?.price &&
        (token.market.floorAsk.validUntil === 0 ||
          token.market.floorAsk.validUntil < Date.now()) && (
          <div className="flex w-full justify-between mt-4">
            <div className="flex">
              {token.market.floorAsk.source?.name && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    ["OpenSea", "LooksRare"].includes(
                      token.market.floorAsk.source.name,
                    )
                      ? token.market.floorAsk.source.url
                      : undefined
                  }
                >
                  <img
                    className="h-8 w-8"
                    src={getMarketIcon(token.market.floorAsk.source.name)}
                  />
                </a>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-2">
                <EthIcon className="inline-block w-4" />{" "}
                <span className="text-4xl font-bold font-mono tracking-tighter">
                  {token.market.floorAsk.price}
                </span>
              </span>
              {token.market.floorAsk.validUntil !== 0 && (
                <span className="text-sm text-gray-500">
                  on sale until{" "}
                  {formatDateTimeHuman(token.market.floorAsk.validUntil * 1000)}
                </span>
              )}
            </div>
          </div>
        )}

      {token && metadata && (
        <div className="flex flex-col w-full gap-y-2 mt-2">
          {!active && <ConnectWalletButton />}

          {/* IS NOT OWNER: Buy at list price */}
          {active && !isOwner && token?.market?.floorAsk?.price && (
            <div className="w-full">
              <BuyButton
                amount={token.market.floorAsk.price}
                onSuccess={() => {
                  mutateTokenData();
                  mutateMetadata();
                  mutateBuyOrdersData();
                }}
                tokenId={token.token.tokenId}
              />
            </div>
          )}

          {/* NOT OWNER: Make an offer */}
          {active && !isOwner && (
            <div className="w-full">
              <OfferButton
                tokenId={token.token.tokenId}
                ens={ens}
                onSuccess={() => {
                  mutateBuyOrdersData();
                }}
              />
            </div>
          )}

          {/* IS OWNER: Sell now for best bid */}
          {active && isOwner && token?.market?.topBid?.value && (
            <div className="w-full">
              <SellButton
                tokenId={token.token.tokenId}
                amount={token.market.topBid.value}
                onSuccess={() => {
                  mutateTokenData();
                  mutateOwnerData();
                  mutateBuyOrdersData();
                  mutateMetadata();
                }}
              />
            </div>
          )}

          {/* IS OWNER: List for sale */}
          {active && isOwner && (
            <div className="w-full">
              <ListButton
                tokenId={token.token.tokenId}
                ens={ens}
                currentPrice={token?.market?.floorAsk?.price}
                onSuccess={() => mutateTokenData()}
              />
            </div>
          )}
        </div>
      )}

      {!!buyOrders.length && (
        <div className="w-full mt-8">
          <h2 className="text-3xl font-medium">current offers</h2>
          <table className="w-full border-collapse">
            <thead className="border-b-1 border-t-1 border-black">
              <tr className="text-left">
                <th>buyer</th>
                <th>expires?</th>
                <th>price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filterBuyOrders(buyOrders).map((order, i) => (
                <Offer
                  key={i}
                  order={order}
                  owner={owner}
                  onAcceptSuccess={() => {
                    mutateTokenData();
                    mutateOwnerData();
                    mutateBuyOrdersData();
                    mutateMetadata();
                  }}
                  onCancelSuccess={() => {
                    mutateTokenData();
                    mutateBuyOrdersData();
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

Name.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
