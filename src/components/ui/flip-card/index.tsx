import { useState } from "react";
import ReactCardFlip, { ReactFlipCardProps } from "react-card-flip";
import styles from "./styles.module.css";
import { cn } from "@/utils/class-name";

type FlipCardContent = {
  wrapperClassName?: string;
  content: React.ReactElement;
};

interface FlipCardProps extends Omit<ReactFlipCardProps, "children"> {
  wrapperClassName?: string;
  front: FlipCardContent;
  back: FlipCardContent;
}

const FlipCard = ({
  front,
  back,
  wrapperClassName,
  ...flipCardProps
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="vertical"
        {...flipCardProps}
      >
        {/* Front side */}
        <div
          className={cn(styles.front, front?.wrapperClassName)}
          onClick={handleClick}
        >
          {front?.content}
          <svg
            className="absolute bottom-5 right-5 text-white"
            width="32"
            height="39"
            viewBox="0 0 25 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.7873 31.1H9.30854C8.72663 31.1 8.27403 30.6474 8.27403 30.0655C8.27403 28.4491 7.49814 27.5439 6.33432 26.1214C5.68775 25.3455 4.97652 24.4403 4.2653 23.3412C2.32559 20.173 0.579848 16.5522 0.191906 15.1297C-0.196036 13.7073 0.0625878 12.8667 0.45053 12.3495C0.903128 11.7029 1.67901 11.3796 2.58421 11.3796C3.81269 11.3796 5.10584 12.4141 6.20501 13.7719V3.10353C6.20501 1.35779 7.62746 0 9.30854 0C10.9896 0 12.4121 1.42245 12.4121 3.10353V7.43555C12.7354 7.30624 13.0586 7.24159 13.4466 7.24159C14.5458 7.24159 15.5156 7.82349 16.0975 8.66403C16.5501 8.4054 17.0674 8.27608 17.6493 8.27608C19.0717 8.27608 20.3002 9.24594 20.6235 10.5391C20.9468 10.4098 21.3347 10.3451 21.7873 10.3451C23.5331 10.3451 24.8909 11.7676 24.8909 13.4486V16.5522C24.8909 19.2031 24.3736 21.4014 23.8564 23.4705C23.3391 25.6042 22.8218 27.5439 22.8218 30.0008C22.8218 30.5827 22.3692 31.1 21.7873 31.1ZM10.343 29.031H20.8175C20.9468 26.768 21.3994 24.8929 21.852 23.0179C22.3692 20.9489 22.8218 18.9445 22.8218 16.5522V13.2547C22.8218 12.6728 22.3692 12.2202 21.7873 12.2202C21.2054 12.2202 20.7528 12.6728 20.7528 13.2547V14.4832C20.7528 15.0651 20.3002 15.5177 19.7183 15.5177C19.1364 15.5177 18.6838 15.0651 18.6838 14.4832V11.1856C18.6838 10.6037 18.2312 10.1512 17.6493 10.1512C17.0674 10.1512 16.6148 10.6037 16.6148 11.1856V13.4486C16.6148 14.0306 16.1622 14.4832 15.5803 14.4832C14.9984 14.4832 14.5458 14.0306 14.5458 13.4486V10.1512C14.5458 9.56924 14.0932 9.11664 13.5112 9.11664C12.9293 9.11664 12.4767 9.56924 12.4767 10.1512V12.4141C12.4767 12.9961 12.0241 13.4486 11.4422 13.4486C10.8603 13.4486 10.4077 12.9961 10.4077 12.4141V2.8449C10.4077 2.26299 9.95511 1.81039 9.37319 1.81039C8.79128 1.81039 8.33869 2.26299 8.33869 2.8449V18.6212C8.33869 19.2031 7.88609 19.6557 7.30417 19.6557C6.72226 19.6557 6.26966 19.2031 6.26966 18.6212V17.7807C5.36446 15.3884 3.29544 13.3193 2.64887 13.3193C2.39024 13.3193 2.26093 13.384 2.19628 13.578C2.13162 13.7073 2.06696 14.0306 2.19628 14.4832C2.51956 15.5823 4.13598 18.9445 6.14035 22.242C6.78691 23.2765 7.43348 24.0524 8.08005 24.8283C9.11457 26.1214 10.0198 27.2852 10.343 29.031Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Back side */}
        <div
          className={cn(styles.back, back?.wrapperClassName)}
          onClick={handleClick}
        >
          {back?.content}
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default FlipCard;
