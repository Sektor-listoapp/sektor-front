import { RecognitionType } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import React from "react";

interface OrganizationRecognitionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  recognitions: RecognitionType[];
  label?: string;
}

const OrganizationRecognitions = ({
  recognitions,
  label,
  className,
  ...props
}: OrganizationRecognitionsProps) => {
  return (
    <section
      className={cn("w-full mt-5 flex flex-col gap-10", className)}
      {...props}
    >
      <h3 className="text-xl font-semibold font-century-gothic text-blue-500 lg:text-2xl">
        {label || "Estudios realizados"}
      </h3>

      <ul className="list-disc list-inside w-full my-4 lg:text-base">
        {recognitions.map(({ id, title = "", giver = "" }, index) => (
          <li key={`${id}-${index}`}>
            {giver ? `${title} - ${giver}` : title}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OrganizationRecognitions;
