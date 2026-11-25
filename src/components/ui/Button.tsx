import Link from "next/link";
import { type ComponentProps, type ReactNode, forwardRef } from "react";

import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-variants";

export { buttonClass, buttonVariants } from "@/components/ui/button-variants";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
}

type LinkProps = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className"
  >;
type NativeProps = CommonProps & { href?: undefined } & ComponentProps<"button">;

export type ButtonProps = LinkProps | NativeProps;

/** The Afram pill. With `href` it renders a Next link, otherwise a <button>. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref,
) {
  const cls = buttonVariants(variant, size, className);
  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} className={cls} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
});
