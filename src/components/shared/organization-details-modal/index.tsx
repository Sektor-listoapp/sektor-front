import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal } from "antd";

const OrganizationDetailsModal = () => {
  const router = useRouter();
  const detailsQuery = router?.query?.details as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (detailsQuery) {
      setIsModalOpen(true);
    }
  }, [detailsQuery]);

  const handleModalClose = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { details: _, ...query } = router?.query || {};
    console.log("query", query);
    setIsModalOpen(false);
    router.replace({ pathname: router.pathname, query }, undefined, {
      scroll: false,
    });
  };

  const [orgType, orgId] = detailsQuery?.split("-") || [];

  return (
    <Modal
      title="Organization Details:"
      open={isModalOpen}
      onClose={handleModalClose}
      onCancel={handleModalClose}
    >
      <p>Organization Type: {orgType}</p>
      <p>Organization Id: {orgId}</p>
    </Modal>
  );
};

export default OrganizationDetailsModal;
