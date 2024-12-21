import clsx from "clsx";
import { FC } from "react";

interface StepperProps {
  className?: string;
}

const Stepper: FC<StepperProps> = ({ className = "" }) => {
  return (
    <ul className={clsx("relative flex flex-row gap-x-2", className)}>
      <li className="shrink basis-0 flex-1 group">
        <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
          <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full">
            1
          </span>
          <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden"></div>
        </div>
        <div className="mt-3">
          <span className="block text-sm font-medium text-white">
            Tipo de usuario
          </span>
        </div>
      </li>

      <li className="shrink basis-0 flex-1 group">
        <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
          <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full">
            2
          </span>
          <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden"></div>
        </div>
        <div className="mt-3">
          <span className="block text-sm font-medium text-white">
            Ingresa los datos
          </span>
        </div>
      </li>

      <li className="shrink basis-0 flex-1 group">
        <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
          <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full">
            3
          </span>
          <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden"></div>
        </div>
        <div className="mt-3">
          <span className="block text-sm font-medium text-white">
            Link enviado
          </span>
        </div>
      </li>

      <li className="shrink basis-0 flex-1 group">
        <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs align-middle">
          <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full">
            3
          </span>
          <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden"></div>
        </div>
        <div className="mt-3">
          <span className="block text-sm font-medium text-white">
            Cuenta verificada
          </span>
        </div>
      </li>
    </ul>
  );
};

export default Stepper;
