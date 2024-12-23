import React from "react";

const Circle = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="681"
      height="1024"
      viewBox="0 0 681 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="81" cy="525" rx="600" ry="601" fill="currentColor" />
    </svg>
  );
};

export default Circle;
