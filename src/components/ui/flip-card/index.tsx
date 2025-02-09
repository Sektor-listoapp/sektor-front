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
