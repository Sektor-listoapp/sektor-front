import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { StudyInputType } from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import DatePicker from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { ObjectId } from "bson";

interface StudiesModalProps extends ModalProps {
  open: boolean;
  studyToEdit?: StudyInputType | null;
  setOpenStudiesModal: (value: React.SetStateAction<boolean>) => void;
  studies?: StudyInputType[];
  onStudiesChange?: (studies: StudyInputType[]) => void;
}

const StudiesModal = ({
  open,
  setOpenStudiesModal,
  studies = [],
  onStudiesChange,
  studyToEdit,
  ...modalProps
}: StudiesModalProps) => {
  const isEditing = Boolean(studyToEdit?.id);
  const [input, setInput] = useState({
    title: "",
    institution: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (studyToEdit?.id) {
      setInput({
        title: studyToEdit?.title || "",
        institution: studyToEdit?.institution || "",
        startDate: studyToEdit?.startDate || "",
        endDate: studyToEdit?.endDate || "",
        description: studyToEdit?.description || "",
      });
    } else {
      setInput({
        title: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [studyToEdit]);

  const handleClose = () => {
    setInput({
      title: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setOpenStudiesModal(false);
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
    if (studyToEdit?.id && onStudiesChange) {
      const updatedStudies = studies.map((study) =>
        study.id === studyToEdit?.id ? { ...study, ...input } : study
      );
      onStudiesChange(updatedStudies);
    }
    handleClose();
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit();
      return;
    }

    if (!onStudiesChange) return;

    const newStudy: StudyInputType = {
      id: new ObjectId() as unknown as string,
      title: input?.title,
      institution: input?.institution,
      startDate: input?.startDate,
      endDate: input?.endDate,
      description: input?.description,
    };

    const existingIndex = studies.findIndex(study => {
      const titleMatch = study.title?.toLowerCase().trim() === newStudy.title?.toLowerCase().trim();
      const institutionMatch = study.institution?.toLowerCase().trim() === newStudy.institution?.toLowerCase().trim();
      const startDateMatch = study.startDate === newStudy.startDate;
      const endDateMatch = study.endDate === newStudy.endDate;

      return titleMatch && institutionMatch && startDateMatch && endDateMatch;
    });

    if (existingIndex !== -1) {
      const updatedStudies = studies.map((study, index) =>
        index === existingIndex ? newStudy : study
      );
      onStudiesChange(updatedStudies);
    } else {
      onStudiesChange([...studies, newStudy]);
    }

    handleClose();
  };

  const hasEmptyFields =
    !input?.title?.trim() ||
    !input?.institution?.trim() ||
    !input?.startDate ||
    !input?.endDate;

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
            {isEditing ? "Editar estudios" : "Agregar estudios"}
          </h2>
        </header>
        <div className="flex flex-col gap-8 items-center">
          <TextInput
            name="giver"
            placeholder="Institución educativa"
            value={input?.institution}
            required
            onChange={(e) => handleInputChange("institution", e?.target?.value)}
          />

          <TextInput
            name="title"
            placeholder="Título"
            value={input?.title}
            required
            onChange={(e) => handleInputChange("title", e?.target?.value)}
          />

          <div className="w-full grid grid-cols-1 gap-y-8 gap-x-5 md:grid-cols-2">
            <DatePicker
              name="startDate"
              wrapperClassName="col-span-4 md:col-span-1 w-full"
              placeholder="Fecha de inicio"
              format="DD/MM/YYYY"
              showIcon={false}
              value={input?.startDate ? dayjs(input?.startDate) : undefined}
              defaultValue={undefined}
              maxDate={input?.endDate ? dayjs(input?.endDate) : undefined}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              onChange={(date) => handleInputChange("startDate", date)}
            />

            <DatePicker
              name="endDate"
              wrapperClassName="col-span-4 md:col-span-1 w-full"
              placeholder="Fecha de finalización"
              format="DD/MM/YYYY"
              disabled={!input?.startDate}
              showIcon={false}
              value={input?.endDate ? dayjs(input?.endDate) : undefined}
              minDate={
                input?.startDate
                  ? dayjs(input?.startDate).add(1, "day")
                  : undefined
              }
              defaultValue={undefined}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              onChange={(date) => handleInputChange("endDate", date)}
            />
          </div>

          <TextArea
            className="w-full max-w-xl rounded-xl border-blue-500 text-blue-500"
            placeholder="Descripción"
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
            className="w-fit px-10"
            disabled={hasEmptyFields}
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default StudiesModal;
