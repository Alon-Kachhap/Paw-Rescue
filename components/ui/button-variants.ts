// components/ui/button-variants.ts
export interface ButtonVariantsProps {
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "sm" | "default" | "lg";
    className?: string;
  }
  
  export function buttonVariants({
    variant = "default",
    size = "default",
    className = "",
  }: ButtonVariantsProps): string {
    const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none";
  
    let variantClass = "";
    switch (variant) {
      case "default":
        variantClass = "bg-primary text-primary-foreground hover:bg-primary/90";
        break;
      case "outline":
        variantClass = "border border-input hover:bg-accent hover:text-accent-foreground";
        break;
      case "ghost":
        variantClass = "hover:bg-accent hover:text-accent-foreground";
        break;
      case "link":
        variantClass = "underline-offset-4 hover:underline text-primary";
        break;
      default:
        variantClass = "";
    }
  
    let sizeClass = "";
    switch (size) {
      case "sm":
        sizeClass = "h-8 px-3 text-sm";
        break;
      case "default":
        sizeClass = "h-10 px-4";
        break;
      case "lg":
        sizeClass = "h-12 px-6";
        break;
      default:
        sizeClass = "";
    }
  
    return `${base} ${variantClass} ${sizeClass} ${className}`.trim();
  }
  