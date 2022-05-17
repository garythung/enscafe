import { useState } from "react";

import Button from "~/components/Button";
import ListModal from "~/components/ListModal";

type Props = {
  tokenId: string;
  ens: string;
  currentPrice?: string;
  onSuccess: () => void;
};

export default function ListButton({
  tokenId,
  ens,
  currentPrice,
  onSuccess,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const onClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <ListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tokenId={tokenId}
        ens={ens}
        currentPrice={currentPrice}
        onSuccess={onSuccess}
      />
      <Button fluid variant="secondary" onClick={onClick}>
        {currentPrice ? "lower price" : "list for sale"}
      </Button>
    </>
  );
}
