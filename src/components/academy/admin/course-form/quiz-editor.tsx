import React from "react";
import { Input, Radio, Segmented } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AcademyQuizQuestionType } from "@/lib/sektor-api/__generated__/types";
import { QuizQuestionDraft, emptyQuestion } from "./types";

interface QuizEditorProps {
  questions: QuizQuestionDraft[];
  onChange: (questions: QuizQuestionDraft[]) => void;
  disabled?: boolean;
}

const QuizEditor = ({ questions, onChange, disabled }: QuizEditorProps) => {
  const update = (index: number, patch: Partial<QuizQuestionDraft>) =>
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));

  const changeType = (index: number, type: AcademyQuizQuestionType) => {
    const fresh = emptyQuestion(type);
    update(index, { ...fresh, key: questions[index].key, title: questions[index].title });
  };

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, index) => (
        <div key={q.key} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Pregunta {index + 1}</span>
            <Segmented
              size="small"
              disabled={disabled}
              value={q.type}
              onChange={(v) => changeType(index, v as AcademyQuizQuestionType)}
              options={[
                { label: "V / F", value: AcademyQuizQuestionType.TrueFalse },
                { label: "Múltiple", value: AcademyQuizQuestionType.MultipleChoice },
              ]}
            />
            {!disabled && (
              <button
                type="button"
                aria-label="Eliminar pregunta"
                className="ml-auto text-red-500 hover:text-red-400"
                onClick={() => onChange(questions.filter((_, i) => i !== index))}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>

          <Input
            disabled={disabled}
            placeholder="Escribe la pregunta..."
            value={q.title}
            onChange={(e) => update(index, { title: e.target.value })}
          />

          {q.type === AcademyQuizQuestionType.TrueFalse ? (
            <Radio.Group
              disabled={disabled}
              value={q.correctBooleanAnswer}
              onChange={(e) => update(index, { correctBooleanAnswer: e.target.value })}
            >
              <Radio value={true}>Verdadero</Radio>
              <Radio value={false}>Falso</Radio>
              <span className="text-xs text-gray-500 ml-2">(respuesta correcta)</span>
            </Radio.Group>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500">
                Marca la opción correcta
              </span>
              <Radio.Group
                disabled={disabled}
                value={q.correctIndex}
                onChange={(e) => update(index, { correctIndex: e.target.value })}
                className="flex flex-col gap-2"
              >
                {q.options.map((option, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Radio value={oi} aria-label={`Opción ${oi + 1} correcta`} />
                    <Input
                      disabled={disabled}
                      placeholder={`Opción ${oi + 1}`}
                      value={option}
                      onChange={(e) =>
                        update(index, {
                          options: q.options.map((o, j) => (j === oi ? e.target.value : o)),
                        })
                      }
                    />
                    {!disabled && q.options.length > 2 && (
                      <button
                        type="button"
                        aria-label="Quitar opción"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() =>
                          update(index, {
                            options: q.options.filter((_, j) => j !== oi),
                            correctIndex:
                              q.correctIndex === oi
                                ? 0
                                : q.correctIndex > oi
                                ? q.correctIndex - 1
                                : q.correctIndex,
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    )}
                  </div>
                ))}
              </Radio.Group>
              {!disabled && (
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-400 self-start"
                  onClick={() => update(index, { options: [...q.options, ""] })}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar opción
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {!disabled && (
        <button
          type="button"
          className="text-sm text-blue-500 hover:text-blue-400 self-start"
          onClick={() => onChange([...questions, emptyQuestion()])}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar pregunta
        </button>
      )}
    </div>
  );
};

export default QuizEditor;
