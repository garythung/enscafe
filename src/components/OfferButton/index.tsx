import { useState } from "react";

import Button from "~/components/Button";
import OfferModal from "~/components/OfferModal";

type Props = {
  tokenId: string;
  ens: string;
  onSuccess: () => void;
};

export default function OfferButton({ tokenId, ens, onSuccess }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const onClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <OfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tokenId={tokenId}
        ens={ens}
        onSuccess={onSuccess}
      />
      <Button fluid variant="secondary" onClick={onClick}>
        send offer
      </Button>
    </>
  );
}
