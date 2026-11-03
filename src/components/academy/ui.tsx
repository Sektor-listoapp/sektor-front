import React from "react";
import Button from "@/components/ui/button";
import { cn } from "@/utils/class-name";

/**
 * Shared look for the academy, aligned with the admin "Usuarios" panel
 * (/companies): blue pill buttons, rounded-xl inputs and white cards.
 */

/** Small label chip (modality, category, level…). */
export const Pill = ({
  children,
  solid = false,
  className,
}: {
  children: React.ReactNode;
  solid?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-3xl px-3 py-0.5 text-xs font-century-gothic border",
      solid ? "bg-blue-500 border-blue-500 text-white" : "border-blue-500 text-blue-500 bg-white",
      className
    )}
  >
    {children}
  </span>
);

interface ToggleOption<T extends string> {
  label: React.ReactNode;
  value: T;
}

/** Single-choice selector drawn as solid/outline buttons, like "Ordenar" in /companies. */
export const ToggleButtons = <T extends string>({
  options,
  value,
  onChange,
  label,
  disabled,
  className,
}: {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3", className)}>
    {label && <span className="text-sm font-century-gothic text-blue-500 shrink-0">{label}</span>}
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "solid-blue" : "outline"}
          className="text-sm px-4 py-2"
          disabled={disabled}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  </div>
);

/** Tabs drawn with ToggleButtons; only the active panel is mounted. */
export const ButtonTabs = <T extends string>({
  items,
  activeKey,
  onChange,
}: {
  items: { key: T; label: React.ReactNode; children: React.ReactNode }[];
  activeKey: T;
  onChange: (key: T) => void;
}) => (
  <div className="flex flex-col gap-6">
    <ToggleButtons
      options={items.map((item) => ({ label: item.label, value: item.key }))}
      value={activeKey}
      onChange={onChange}
    />
    <div>{items.find((item) => item.key === activeKey)?.children}</div>
  </div>
);

/** White card with the same shadow/radius as the /companies section. */
export const Panel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "bg-white w-full py-5 md:py-8 px-4 md:px-8 flex flex-col gap-6 shadow-xl xl:shadow-2xl rounded-xl",
      className
    )}
  >
    {children}
  </section>
);
