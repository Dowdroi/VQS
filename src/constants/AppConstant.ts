import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  img?: {
    src: string;
    className: string;
  };
  icon?: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label?: string;
  description?: string;
  children?: NavItem[];
  hideInNav?: boolean;
}
