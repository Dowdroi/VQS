import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
// Define the text variants with the specified styles
const textVariants = cva("", {
  variants: {
    variant: {
      "title-42-bold": "text-[42px] leading-[58px] font-bold",
      "title-32-bold": "text-[32px] leading-[40px] font-bold",
      "title-24-bold": "text-[24px] leading-[36px] font-bold",
      "title-22-bold": "text-[22px] leading-[30px] font-bold",
      "title-16-bold": "text-[16px] leading-[22px] font-bold",
      "title-28-bold": "text-[28px] leading-[36px] font-bold",

      "title-26-regular": "text-[26px] leading-[32px] font-normal",
      "title-24-regular": "text-[24px] leading-[36px] font-normal",

      "subtitle-20-bold": "text-[20px] leading-[24px] font-bold",
      "subtitle-18-bold": "text-[18px] leading-[24px] font-bold",
      "subtitle-16-bold": "text-[16px] leading-[22px] font-bold",
      "subtitle-14-bold": "text-[14px] leading-[20px] font-bold",
      "subtitle-11-bold": "text-[11px] leading-[20px] font-bold",

      "subtitle-20-regular": "text-[20px] leading-[26px] font-normal",
      "subtitle-18-regular": "text-[18px] leading-[24px] font-normal",
      "subtitle-16-regular": "text-[16px] leading-[22px] font-normal",

      "body-16-bold": "text-[16px] leading-[22px] font-bold",

      "body-16-regular": "text-[16px] leading-[22px] font-normal",
      "body-14-regular": "text-[14px] leading-[22px] font-normal",

      "subtext-14-regular": "text-[14px] leading-[20px] font-normal",
      "subtext-12-regular": "text-[12px] leading-[20px] font-normal",
      "subtext-11-regular": "text-[11px] leading-[20px] font-normal",

      "text-20-leading-27": "text-[20px] leading-[27px]",
      "text-16-leading-20": "text-[16px] leading-[20px]",
      "text-16-leading-18": "text-[16px] leading-[18px]",
      "text-14-leading-18": "text-[14px] leading-[18px]",
      "text-14-leading-17": "text-[14px] leading-[17px]",
      "text-14-leading-16": "text-[14px] leading-[16px]",
      "text-13-leading-18": "text-[13px] leading-[18px]",
      "text-12-leading-18": "text-[12px] leading-[18px]",

      "button-16": "text-[16px] leading-[20px] font-bold",
      "link-16": "text-[16px] leading-[22px] font-bold",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "subtext-12-regular",
    size: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

// Update the component to use <span> instead of <button>
const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(textVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { textVariants as textStyles };
export default Text;
