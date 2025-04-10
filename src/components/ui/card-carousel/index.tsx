import React from "react";
import { cn } from "@/utils/class-name";
import styles from "./index.module.css";

interface CardCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardCarousel = ({ className, children, ...props }: CardCarouselProps) => {
  return (
    <div
      className={cn(
        "flex flex-no-wrap overflow-x-scroll scrolling-touch justify-start items-start gap-4 w-full h-fit pb-2 pl-1",
        className,
        styles.container,
        {
          hidden: !children,
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardCarousel;
