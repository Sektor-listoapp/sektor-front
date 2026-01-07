import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { RecognitionType } from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import DatePicker from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { ObjectId } from "bson";

interface RecognitionModalProps extends ModalProps {
  open: boolean;
  recognitionToEdit?: RecognitionType | null;
  setOpenRecognitionModal: (value: React.SetStateAction<boolean>) => void;
  recognitions?: RecognitionType[];
  onRecognitionsChange?: (recognitions: RecognitionType[]) => void;
}

const LocalRecognitionModal = ({
  open,
  setOpenRecognitionModal,
  recognitions = [],
  onRecognitionsChange,
  recognitionToEdit,
  ...modalProps
}: RecognitionModalProps) => {
  const isEditing = Boolean(recognitionToEdit?.id);
  const [input, setInput] = useState({
    title: "",
    giver: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (recognitionToEdit?.id) {
      setInput({
        title: recognitionToEdit?.title || "",
        giver: recognitionToEdit?.giver || "",
        date: recognitionToEdit?.date || "",
        description: recognitionToEdit?.description || "",
      });
    } else {
      setInput({
        title: "",
        giver: "",
        date: "",
        description: "",
      });
    }
  }, [recognitionToEdit]);

  const handleClose = () => {
    setInput({
      title: "",
      giver: "",
      date: "",
      description: "",
    });
    setOpenRecognitionModal(false);
  };

  const handleInputChange = (
    field: keyof typeof input,
    value: string | string[] | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (field in input) {
      setInput((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    }
  };

  const handleEdit = () => {
    if (recognitionToEdit?.id && onRecognitionsChange) {
      const updatedRecognitions = recognitions.map((recognition) =>
        recognition.id === recognitionToEdit?.id
          ? { ...recognition, ...input }
          : recognition
      );
      onRecognitionsChange(updatedRecognitions);
    }
    handleClose();
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit();
      return;
    }

    if (!onRecognitionsChange) return;

    const newRecognition: RecognitionType = {
      id: new ObjectId() as unknown as string,
      title: input?.title,
      giver: input?.giver,
      date: input?.date,
      description: input?.description,
    };

    const existingIndex = recognitions.findIndex(recognition => {
      const titleMatch = recognition.title?.toLowerCase().trim() === newRecognition.title?.toLowerCase().trim();
      const giverMatch = recognition.giver?.toLowerCase().trim() === newRecognition.giver?.toLowerCase().trim();
      const dateMatch = recognition.date === newRecognition.date;

      return titleMatch && giverMatch && dateMatch;
    });

    if (existingIndex !== -1) {
      const updatedRecognitions = recognitions.map((recognition, index) =>
        index === existingIndex ? newRecognition : recognition
      );
      onRecognitionsChange(updatedRecognitions);
    } else {
      onRecognitionsChange([...recognitions, newRecognition]);
    }

    handleClose();
  };

  const hasEmptyFields =
    !input?.title?.trim() || !input?.giver?.trim() || !input?.date?.trim();

  return (
    <Modal
      open={open}
      closeIcon={null}
      footer={null}
      onClose={handleClose}
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
            {isEditing ? "Editar reconocimiento" : "Añadir reconocimiento"}
          </h2>
        </header>
        <div
          className="flex flex-col gap-8 items-center"
          onSubmit={handleSubmit}
        >
          <TextInput
            name="title"
            placeholder="Reconocimiento recibido"
            value={input?.title}
            required
            onChange={(e) => handleInputChange("title", e?.target?.value)}
          />

          <TextInput
            name="giver"
            placeholder="Entregado por"
            value={input?.giver}
            required
            onChange={(e) => handleInputChange("giver", e?.target?.value)}
          />

          <DatePicker
            name="data"
            wrapperClassName="col-span-4 sm:col-span-2 w-full xl:col-span-1"
            placeholder="Fecha de estudios"
            onChange={(_, dateString) =>
              handleInputChange("date", dateString || "")
            }
            maxDate={dayjs().subtract(1, "day")}
            format="DD/MM/YYYY"
            showIcon={false}
          />

          <TextArea
            className="w-full max-w-xl rounded-xl border-blue-500 text-blue-500"
            placeholder="Observaciones"
            value={input?.description}
            allowClear
            onChange={(e) =>
              handleInputChange("description", e?.target?.value || "")
            }
            styles={{
              textarea: {
                minHeight: "100px",
                padding: "1rem",
                fontFamily: "Century Gothic",
                color: "#182F48",
              },
            }}
          />

          <Button
            variant="solid-blue"
            onClick={handleSubmit}
            className="w-fit px-10"
            disabled={hasEmptyFields}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default LocalRecognitionModal;
