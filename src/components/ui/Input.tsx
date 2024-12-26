import * as React from "react";
import { cn } from "@/lib/utils";
import {
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  icColor?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      icColor = "#5F6368",
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(value || "");
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const passwordToggleIcon = showPassword ? (
      <EyeSlashIcon onClick={togglePasswordVisibility} />
    ) : (
      <EyeIcon onClick={togglePasswordVisibility} />
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const handleDateIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (ref && "current" in ref && ref.current) {
        ref.current.focus();
        ref.current.click();
      }
    };

    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    return (
      <div className="relative w-full h-full">
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            "flex custom-focus focus:ring-2 h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-sm",
            leftIcon ? "pl-[35px]" : "pl-[11px]",
            type === "password" || type === "date" || rightIcon
              ? "pr-[35px]"
              : "pr-[11px]",
            type === "date" && "appearance-none",
            className
          )}
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          {...props}
        />
        {leftIcon &&
          React.cloneElement(leftIcon, {
            className:
              "absolute left-[11px] top-1/2 transform -translate-y-1/2",
            color: icColor,
          })}
        {type === "password" &&
          React.cloneElement(passwordToggleIcon, {
            className:
              "h-6 w-6 absolute right-[11px] top-1/2 transform -translate-y-1/2 hover:cursor-pointer",
            color: icColor,
          })}
        {type === "date" && (
          <div
            className="absolute right-[11px] top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleDateIconClick}
          >
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        {type !== "password" &&
          type !== "date" &&
          rightIcon &&
          React.cloneElement(rightIcon, {
            className:
              "h-6 w-6 absolute right-[11px] top-1/2 transform -translate-y-1/2",
            color: icColor,
          })}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
