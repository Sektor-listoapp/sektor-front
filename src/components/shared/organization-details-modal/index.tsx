import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal } from "antd";
import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";
import { ORGANIZATION_DETAILS_CONTENT_MAP } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

type OrgType =
  | OrganizationTypes.BrokerageSociety
  | OrganizationTypes.ExclusiveAgent
  | OrganizationTypes.InsuranceBroker
  | OrganizationTypes.InsuranceCompany
  | OrganizationTypes.Supplier;

const OrganizationDetailsModal = () => {
  const router = useRouter();
  const detailsQuery = router?.query?.details as string;
  const orgType = (detailsQuery?.split("-")[0] as OrgType) || "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const OrganizationDetails = 
      ORGANIZATION_DETAILS_CONTENT_MAP[orgType as OrgType];

  const handleModalClose = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { details: _, ...query } = router?.query || {};
    setIsModalOpen(false);
    router.replace({ pathname: router.pathname, query }, undefined, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (detailsQuery) {
      setIsModalOpen(true);
    }
  }, [detailsQuery]);

  if (!detailsQuery) {
    return null;
  }

  return (
    <Modal
      footer={null}
      open={isModalOpen}
      className="!w-11/12 md:!w-3/4 lg:!w-11/12 !max-w-6xl"
      onClose={handleModalClose}
      onCancel={handleModalClose}
      closeIcon={
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-blue-500"
          size="2xl"
        />
      }
    >
      <OrganizationDetails />
    </Modal>
  );
};

export default OrganizationDetailsModal;
