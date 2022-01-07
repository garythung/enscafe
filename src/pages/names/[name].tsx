import { validate } from "@ensdomains/ens-validation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { WyvernV2 } from "@reservoir0x/sdk";
import { ethers } from "ethers";
import Head from "next/head";

import { getIndexer } from "~/utils/indexers";
import api, { useGetter } from "~/utils/api";
import { getTokenIdFromName } from "~/utils/ens";
import Layout from "~/layouts";
import WordArt from "~/components/WordArt";
import useENSName from "~/hooks/useENSName";
import LinkButton from "~/components/LinkButton";
import useWallet from "~/hooks/useWallet";
import Button from "~/components/Button";
import BuyButton from "~/components/BuyButton";
import Card from "~/components/Card";
import EthIcon from "~/components/EthIcon";
import OfferButton from "~/components/OfferButton";
import SellButton from "~/components/SellButton";
import ListButton from "~/components/ListButton";
import { getContract } from "~/utils/contracts";
import { useToast } from "~/contexts/ToastContext";
import { getChainId } from "~/utils/networks";
import { formatDateHuman, formatDateTimeHuman } from "~/utils/dates";
import { simplifyAddress, isAddress } from "~/utils/addresses";

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
  <div className="flex flex-col items-center mt-8 md:mt-24 md:px-112">
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
  const ensName = useENSName(order.maker);
  const isMaker = active && account && account === isAddress(order.maker);
  const isOwner = active && account && account === isAddress(owner);
  const hasExpiration = order.validUntil !== 0;
  const validUntilDate = new Date(order.validUntil * 1000);

  const handleAccept = async (orderHash: string) => {
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
    onAcceptSuccess();

    addToast(
      <span className="flex items-center">
        sold for
        <EthIcon className="inline-block w-2 ml-1 mr-1" />
        <span className="font-mono tracking-tighter">
          {ethers.utils.formatUnits(
            buyOrderResponse.data.orders[0].rawData.basePrice,
          )}
        </span>
      </span>,
      "success",
    );
  };

  const handleCancel = async (orderHash: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const buyOrderResponse = await api.get(
      `${getIndexer()}/orders?side=buy&hash=${orderHash}`,
    );

    const buyOrder = new WyvernV2.Order(
      getChainId(),
      buyOrderResponse.data.orders[0].rawData,
    );

    const exchange = new WyvernV2.Exchange(getChainId());
    const { wait } = await exchange.cancel(
      provider.getSigner() as any,
      buyOrder,
    );

    await wait();
    onCancelSuccess();

    addToast(
      <span className="flex items-center">
        canceled offer of
        <EthIcon className="inline-block w-2 ml-1 mr-1" />
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
    <tr>
      <td className="py-1.5 border-b-1 border-gray-500 border-dashed">
        {simplifyAddress(order.maker, account, ensName)}
      </td>
      <td
        className="py-1.5 border-b-1 border-gray-500 border-dashed"
        title={hasExpiration ? validUntilDate.toLocaleString() : undefined}
      >
        {hasExpiration && validUntilDate.toLocaleDateString()}
      </td>
      <td className="py-1.5 border-b-1 border-gray-500 border-dashed">
        <div className="flex items-center gap-x-1">
          <EthIcon className="inline-block w-2" />{" "}
          <span className="font-mono tracking-tighter">{order.value}</span>
        </div>
      </td>
      <td className="py-1.5 border-b-1 border-gray-500 border-dashed">
        {isMaker && (
          <Button
            onClick={() => handleCancel(order.hash)}
            variant="pill-secondary"
          >
            cancel
          </Button>
        )}
        {isOwner && (
          <Button
            onClick={() => handleAccept(order.hash)}
            variant="pill-secondary"
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
  const { account, activate, active } = useWallet();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState<Status>("redirecting");
  const ens = (router.query.name as string) || ""; // has .eth ending
  const ensWithoutTLD = ens ? ens.slice(0, ens.length - 4) : "";
  const isLongEnough = ensWithoutTLD.length >= 3;
  const isValid = isLongEnough && validate(ensWithoutTLD);
  const { data: tokenData, mutate: mutateTokenData } = useGetter(
    `${getIndexer()}/tokens/details?tokenId=${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}&contract=${getContract("ens")}`,
    status === "ready" && !!ens && !!ensWithoutTLD,
  );
  const { data: ownerData, mutate: mutateOwnerData } = useGetter(
    `${getIndexer()}/owners?tokenId=${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}&contract=${getContract("ens")}`,
    status === "ready" &&
      !!tokenData?.tokens.length &&
      !!ens &&
      !!ensWithoutTLD,
  );
  const { data: buyOrdersData, mutate: mutateBuyOrdersData } = useGetter(
    `${getIndexer()}/orders?tokenId=${getTokenIdFromName(
      ens.slice(0, ens.length - 4),
    )}&contract=${getContract("ens")}&side=buy&includeInvalid=false`,
    status === "ready" &&
      !!tokenData?.tokens.length &&
      !!ens &&
      !!ensWithoutTLD,
  );
  const { data: metadata, mutate: mutateMetadata } = useGetter(
    `https://metadata.ens.domains/rinkeby/${getContract(
      "ens",
    )}/${getTokenIdFromName(ens.slice(0, ens.length - 4))}`,
    status === "ready" &&
      !!tokenData?.tokens.length &&
      !!ens &&
      !!ensWithoutTLD,
  );

  // conveniences
  const token = tokenData?.tokens[0];
  const owner: string | false = isAddress(ownerData?.owners[0].address);
  const buyOrders = buyOrdersData?.orders || [];
  const ownerENSName = useENSName(owner || "");

  useEffect(() => {
    if (!ens) {
      return;
    }

    // route to .eth ending
    if (ens.slice(ens.length - 4) !== ".eth") {
      router.push(`/names/${ens.toLowerCase()}.eth`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/names/${ens.toLowerCase()}`, undefined, {
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
        <div className="flex w-full items-center justify-between mt-4">
          <div>
            <p>owned by {simplifyAddress(owner, account, ownerENSName)}</p>
          </div>

          {token?.market?.floorSell?.value &&
            (token.market.floorSell.validUntil === 0 ||
              token.market.floorSell.validUntil < Date.now()) && (
              <div className="flex flex-col items-end">
                <span className="flex items-center gap-3">
                  <EthIcon className="inline-block w-4" />{" "}
                  <span className="text-4xl font-medium font-mono">
                    {token.market.floorSell.value}
                  </span>
                </span>
                {token.market.floorSell.validUntil !== 0 && (
                  <span className="text-sm text-gray-500">
                    on sale until{" "}
                    {formatDateTimeHuman(
                      token.market.floorSell.validUntil * 1000,
                    )}
                  </span>
                )}
              </div>
            )}
        </div>
      )}

      {token && metadata && (
        <div className="flex flex-col w-full gap-y-2 mt-4">
          {!active && (
            <Button fluid onClick={activate}>
              connect wallet
            </Button>
          )}

          {/* IS NOT OWNER: Buy at list price */}
          {active && !isOwner && token?.market?.floorSell?.value && (
            <div className="w-full">
              <BuyButton
                ens={ens}
                onSuccess={() => {
                  mutateTokenData();
                  mutateMetadata();
                  mutateBuyOrdersData();
                }}
                orderHash={token.market.floorSell.hash}
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
          {active && isOwner && token?.market?.topBuy?.value && (
            <div className="w-full">
              <SellButton
                tokenId={token.token.tokenId}
                ens={ens}
                orderHash={token.market.topBuy.hash}
                amount={token.market.topBuy.value}
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
                currentPrice={token?.market?.floorSell?.value}
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
