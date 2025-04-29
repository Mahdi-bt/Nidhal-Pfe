// This file provides type declarations for modules that don't have their own typings

// Next.js modules
declare module "next/link" {
  import { ComponentType, ReactNode } from "react";
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children: ReactNode;
    [key: string]: any;
  }
  
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    pathname: string;
  };
  
  export function usePathname(): string;
}

// UI Components
declare module "@/components/ui/button" {
  import { ComponentType, ReactNode } from "react";
  
  interface ButtonProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export const Button: ComponentType<ButtonProps>;
}

declare module "@/components/ui/input" {
  import { ComponentType } from "react";
  
  interface InputProps {
    type?: string;
    className?: string;
    [key: string]: any;
  }
  
  export const Input: ComponentType<InputProps>;
}

declare module "@/components/ui/label" {
  import { ComponentType, ReactNode } from "react";
  
  interface LabelProps {
    htmlFor?: string;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export const Label: ComponentType<LabelProps>;
}

declare module "@/components/ui/card" {
  import { ComponentType, ReactNode } from "react";
  
  interface CardProps {
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export const Card: ComponentType<CardProps>;
  export const CardHeader: ComponentType<CardProps>;
  export const CardTitle: ComponentType<CardProps>;
  export const CardDescription: ComponentType<CardProps>;
  export const CardContent: ComponentType<CardProps>;
  export const CardFooter: ComponentType<CardProps>;
}

declare module "@/components/ui/alert" {
  import { ComponentType, ReactNode } from "react";
  
  interface AlertProps {
    variant?: string;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export const Alert: ComponentType<AlertProps>;
  export const AlertDescription: ComponentType<AlertProps>;
}

declare module "@/components/ui/badge" {
  import { ComponentType, ReactNode } from "react";
  
  interface BadgeProps {
    variant?: string;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export const Badge: ComponentType<BadgeProps>;
}

// Other components
declare module "@/components/global-nav" {
  import { ComponentType } from "react";
  
  export const GlobalNav: ComponentType;
}

declare module "@/components/footer" {
  import { ComponentType } from "react";
  
  export const Footer: ComponentType;
}

declare module "@/components/hero-section" {
  import { ComponentType } from "react";
  
  export const HeroSection: ComponentType;
}

declare module "@/components/featured-courses" {
  import { ComponentType } from "react";
  
  export const FeaturedCourses: ComponentType;
}

declare module "@/components/testimonials" {
  import { ComponentType } from "react";
  
  export const Testimonials: ComponentType;
}

declare module "lucide-react" {
  import { ComponentType } from "react";
  
  interface IconProps {
    size?: number | string;
    color?: string;
    className?: string;
    [key: string]: any;
  }
  
  export const AlertCircle: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  // Add other icons as needed
} 