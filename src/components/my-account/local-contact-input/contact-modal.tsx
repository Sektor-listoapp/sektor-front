import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import { SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";
import { pickBy } from "lodash";

interface ContactModalProps extends ModalProps {
  open: boolean;
  setOpenContactModal: (value: React.SetStateAction<boolean>) => void;
  contact?: Record<string, string>;
  onContactChange?: (contact: Record<string, string>) => void;
}

const { Website, Phone, EmergencyPhone } =
  SocialMediaPlatform;

const LocalContactModal = ({
  open,
  setOpenContactModal,
  contact = {},
  onContactChange,
  ...modalProps
}: ContactModalProps) => {
  const [input, setInput] = useState({
    [Website]: "",
    [Phone]: "",
    [EmergencyPhone]: "",
  });

  useEffect(() => {
    if (contact && Object.keys(contact).length > 0) {
      setInput({
        [Website]: contact?.[Website] || "",
        [Phone]: contact?.[Phone] || "",
        [EmergencyPhone]: contact?.[EmergencyPhone] || "",
      });
    } else {

      setInput({
        [Website]: "",
        [Phone]: "",
        [EmergencyPhone]: "",
      });
    }
  }, [contact]);

  const handleClose = () => {
    setInput({
      [Website]: "",
      [Phone]: "",
      [EmergencyPhone]: "",
    });
    setOpenContactModal(false);
  };

  const handleSubmit = () => {
    if (!onContactChange) return;
    const cleanedInput = pickBy(input, (value) => Boolean(value));
    onContactChange(cleanedInput);
    handleClose();
  };

  const hasEmptyFields =
    Object?.values(input)?.filter((value) => !value)?.length === 0;

  return (
    <Modal
      open={open}
      closeIcon={null}
      footer={null}
      onClose={handleClose}
      width={800}
      onCancel={handleClose}
      {...modalProps}
    >
      <section className="text-blue-500 flex flex-col gap-10 pb-10">
        <header className="flex flex-col gap-4">
          <div className="w-full flex justify-end">
            <FontAwesomeIcon
              icon={faCircleXmark}
              size="2xl"
              className="cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <h2 className="text-xl font-bold md:text-3xl">
            Información de contacto
          </h2>
        </header>
        <div
          className="flex flex-col gap-8 items-center md:grid md:grid-cols-2 md:gap-8"
          onSubmit={handleSubmit}
        >
          <TextInput
            placeholder="Teléfono"
            value={input?.[Phone]}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                [Phone]: e?.target?.value?.trim(),
              }));
            }}
          />

          <TextInput
            placeholder="Sitio web"
            value={input?.[Website]}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                [Website]: e?.target?.value?.trim(),
              }));
            }}
          />
          {/* <TextInput
            placeholder="Facebook"
            value={input?.[Facebook]}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                [Facebook]: e?.target?.value?.trim(),
              }));
            }}
          /> */}
          <TextInput
            placeholder="Teléfono de emergencia"
            value={input?.[EmergencyPhone]}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                [EmergencyPhone]: e?.target?.value?.trim(),
              }));
            }}
          />
          {/* <TextInput
            placeholder="Instagram"
            value={input?.[Instagram]}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                [Instagram]: e?.target?.value?.trim(),
              }));
            }}
          />
          <TextInput
            placeholder="Twitter"
            value={input?.[Twitter]}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                [Twitter]: e?.target?.value?.trim(),
              }));
            }}
          /> */}

          <div className="w-full col-span-2 flex justify-center items-center">
            <Button
              variant="solid-blue"
              onClick={handleSubmit}
              className="w-fit px-10"
              disabled={hasEmptyFields}
            >
              Guardar
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default LocalContactModal;
