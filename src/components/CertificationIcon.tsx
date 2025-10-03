import { getCertificationIcon, getCategoryColors } from "@/lib/certificationIcons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CertificationIconProps {
  provider: string;
  category: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export const CertificationIcon = ({
  provider,
  category,
  size = "md",
  showTooltip = false,
  className
}: CertificationIconProps) => {
  const Icon = getCertificationIcon(provider);
  const colors = getCategoryColors(category);

  const sizeClasses = {
    sm: "w-10 h-10 p-2",
    md: "w-12 h-12 p-2.5",
    lg: "w-16 h-16 p-3"
  };

  const iconSizes = {
    sm: 24,
    md: 28,
    lg: 36
  };

  const iconElement = (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-br transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center",
        colors.gradient,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(colors.icon)} size={iconSizes[size]} strokeWidth={1.5} />
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {iconElement}
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{provider}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return iconElement;
};
