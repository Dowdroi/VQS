import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import Input from "@/components/ui/Input";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  note?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  icColor?: string;
  maxWidth?: string;
}

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      type = "text",
      id,
      placeholder,
      value,
      onChange,
      description,
      note,
      className,
      leftIcon,
      rightIcon,
      icColor,
      maxLength,
      maxWidth,
      ...props
    },
    ref
  ) => (
    <div
      className="grid w-full items-center gap-2.5 text-sm leading-5"
      style={{ maxWidth }}
    >
      {label && (
        <Label className="text-neutral-02 font-bold" htmlFor={id}>
          <div className="flex justify-start items-center gap-1">
            {label} <span className="font-normal">{note}</span>
          </div>
          {description && (
            <p className="text-sm leading-5 text-neutral-02 font-normal">
              {description}
            </p>
          )}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn("h-[36px]", className)}
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          icColor={icColor}
          maxLength={maxLength}
          {...props}
        />
      </div>
    </div>
  )
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
