import { RegisterStep } from "@/types/register";
import clsx from "clsx";
import { FC } from "react";

interface StepperProps {
  className?: string;
  currentStep: RegisterStep;
}

const steps = [
  {
    label: "Tipo de usuario",
    index: 0,
  },
  {
    label: "Ingresa los datos",
    index: 1,
  },
  {
    label: "Link enviado",
    index: 2,
  },
  {
    label: "Cuenta verificada",
    index: 3,
  },
];

const Stepper: FC<StepperProps> = ({ className = "", currentStep }) => {
  return (
    <ul
      className={clsx(
        "relative flex flex-row lg:flex-col lg:justify-start lg:items-start",
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = currentStep.index === index;
        return (
          <li
            key={`step-${index}-${step.label}`}
            className="shrink basis-0 flex-1 group lg:min-h-24 lg:flex lg:justify-start lg:items-start lg:last:min-h-32"
          >
            <div className="w-full inline-flex items-center text-sm align-middle lg:flex lg:flex-col-reverse lg:h-full lg:w-10">
              <div className="w-full h-1 flex-1 bg-gray-200 lg:w-1 lg:h-full lg:flex-initial"></div>
              <span className="size-5 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full">
                {isActive && (
                  <div className="size-2 bg-blue-500 rounded-full" />
                )}
              </span>
              <div className="w-full h-1 flex-1 bg-gray-200"></div>
            </div>
            <div className="mt-3 px-3 text-balance text-center lg:mt-0">
              <span
                className={clsx(
                  "block text-xs sm:text-sm  font-century-gothic text-white",
                  isActive ? "font-bold" : "font-normal"
                )}
              >
                {step.label}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Stepper;
