import React, { useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { RecognitionType } from "@/lib/sektor-api/__generated__/types";
import LocalRecognitionModal from "./recognition-modal";

interface RecognitionsInputProps {
  recognitions?: RecognitionType[];
  onRecognitionsChange?: (recognitions: RecognitionType[]) => void;
  disabled?: boolean;
}

const LocalRecognitionsInput = ({
  recognitions = [],
  onRecognitionsChange,
  disabled,
}: RecognitionsInputProps) => {
  const localRecognitionsOptions = useMemo(
    () =>
      recognitions.map((recognition) => ({
        label: recognition?.title || "",
        value: recognition?.id || "",
        data: recognition,
      })),
    [recognitions]
  );

  const [openRecognitionModal, setOpenRecognitionModal] = useState(false);
  const [recognitionToEdit, setRecognitionToEdit] =
    useState<RecognitionType | null>(null);

  return (
    <>
      <div className="w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4">
        <span className="text-sm">Reconocimientos</span>
        <Select
          className="w-full absolute inset-0 h-full opacity-0"
          suffixIcon={null}
          size="large"
          disabled={disabled}
          value={null}
          options={localRecognitionsOptions}
          notFoundContent="No hay reconocimientos"
          optionRender={(option) => (
            <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
              {option.data.label}
              <FontAwesomeIcon
                className="ml-auto cursor-pointer"
                icon={faPen}
                size="lg"
                title="Editar"
                onClick={() => {
                  setRecognitionToEdit(option?.data?.data);
                  setOpenRecognitionModal(true);
                }}
              />
              <FontAwesomeIcon
                className="ml-2 cursor-pointer text-red-500"
                icon={faTrashCan}
                size="lg"
                title="Eliminar"
                onClick={() => {
                  if (onRecognitionsChange) {
                    const updatedRecognitions = recognitions.filter(
                      (recognition) => recognition.id !== option.data.value
                    );
                    onRecognitionsChange(updatedRecognitions);
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
              setRecognitionToEdit(null);
              setOpenRecognitionModal(true);
            }}
          />
        </div>
      </div>
      <LocalRecognitionModal
        open={openRecognitionModal}
        setOpenRecognitionModal={setOpenRecognitionModal}
        recognitions={recognitions}
        onRecognitionsChange={onRecognitionsChange}
        recognitionToEdit={recognitionToEdit}
      />
    </>
  );
};

export default LocalRecognitionsInput;
