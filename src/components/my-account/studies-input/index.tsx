import React, { useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { StudyInputType } from "@/lib/sektor-api/__generated__/types";
import StudiesModal from "./studies-modal";

interface StudiesInputProps {
  studies?: StudyInputType[];
  onStudiesChange?: (studies: StudyInputType[]) => void;
  disabled?: boolean;
}

const StudiesInput = ({ studies = [], onStudiesChange, disabled }: StudiesInputProps) => {
  const localStudiesOptions = useMemo(
    () =>
      studies.map((study) => ({
        label: study?.title || "",
        value: study?.id || "",
        data: study,
      })),
    [studies]
  );

  const [openStudiesModal, setOpenStudiesModal] = useState(false);
  const [studyToEdit, setStudyToEdit] = useState<StudyInputType | null>(null);

  return (
    <>
      <div className="w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4">
        <span className="">Estudios realizados</span>
        <Select
          className="w-full absolute inset-0 h-full opacity-0"
          suffixIcon={null}
          size="large"
          disabled={disabled}
          options={localStudiesOptions}
          value={null}
          notFoundContent="No hay estudios"
          optionRender={(option) => (
            <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
              {option.data.label}
              <FontAwesomeIcon
                className="ml-auto cursor-pointer"
                icon={faPen}
                size="lg"
                title="Editar"
                onClick={() => {
                  setStudyToEdit(option?.data?.data);
                  setOpenStudiesModal(true);
                }}
              />
              <FontAwesomeIcon
                className="ml-2 cursor-pointer text-red-500"
                icon={faTrashCan}
                size="lg"
                title="Eliminar"
                onClick={() => {
                  if (onStudiesChange) {
                    const updatedStudies = studies.filter(
                      (study) => study.id !== option.data.value
                    );
                    onStudiesChange(updatedStudies);
                  }
                }}
              />
            </div>
          )}
        />
        <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
          <FontAwesomeIcon
            icon={faPlus}
            size="xl"
            onClick={() => {
              setStudyToEdit(null);
              setOpenStudiesModal(true);
            }}
          />
        </div>
      </div>
      <StudiesModal
        open={openStudiesModal}
        setOpenStudiesModal={setOpenStudiesModal}
        studies={studies}
        onStudiesChange={onStudiesChange}
        studyToEdit={studyToEdit}
      />
    </>
  );
};

export default StudiesInput;
