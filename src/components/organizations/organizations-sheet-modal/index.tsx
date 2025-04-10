import React from "react";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";

interface OrganizationsSheetModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const organizationsSheetUrl =
  "https://docs.google.com/spreadsheets/d/1M9K30xjD5oR6ijkY9if8g5FA599p0-o6F2xnA3fILl8/edit?pli=1&gid=1376234030#gid=1376234030&fvid=855806470";

const OrganizationsSheetModal = ({
  open,
  setOpen,
}: OrganizationsSheetModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      footer={null}
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      className="!w-11/12 !max-w-[1600px]"
      centered
      closeIcon={
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-blue-500"
          size="lg"
        />
      }
    >
      <section className="flex flex-col items-center justify-center gap-5 text-blue-500 p-5 font-century-gothic w-full">
        <iframe
          className="w-full min-h-[500px] h-[80svh] border-0"
          src={organizationsSheetUrl}
          title="Organizations Sheet"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </section>
    </Modal>
  );
};

export default OrganizationsSheetModal;
