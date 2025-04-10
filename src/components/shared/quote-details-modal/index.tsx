import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal } from "antd";
import { QuoteLineOfBusiness } from "@/lib/sektor-api/__generated__/types";
import { QUOTE_DETAILS_CONTENT_MAP } from "./constants";

const QuoteDetailsModal = () => {
  const router = useRouter();
  const quoteQuery = router?.query?.quote as string;
  const quoteType = (quoteQuery?.split("-")[0] as QuoteLineOfBusiness) || "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const QuoteDetails =
    QUOTE_DETAILS_CONTENT_MAP[quoteType as QuoteLineOfBusiness];

  const handleModalClose = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { quote: _, ...query } = router?.query || {};
    setIsModalOpen(false);
    router.replace({ pathname: router.pathname, query }, undefined, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (quoteQuery) {
      setIsModalOpen(true);
    }
  }, [quoteQuery]);

  if (!quoteQuery) {
    return null;
  }

  return (
    <Modal
      footer={null}
      open={isModalOpen}
      className="!w-11/12 !max-w-4xl"
      onClose={handleModalClose}
      onCancel={handleModalClose}
      closeIcon={null}
    >
      <QuoteDetails />
    </Modal>
  );
};

export default QuoteDetailsModal;
