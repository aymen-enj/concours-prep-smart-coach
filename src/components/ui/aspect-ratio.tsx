
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"
import { forwardRef, HTMLAttributes } from "react"

const AspectRatio = AspectRatioPrimitive.Root

// Wrapper component with additional styling options
const AspectRatioWrapper = forwardRef<
  HTMLDivElement, 
  HTMLAttributes<HTMLDivElement> & { 
    ratio?: number, 
    className?: string,
    rounded?: boolean,
    shadow?: boolean,
    hover?: boolean,
    border?: boolean
  }
>(({ 
  ratio = 16 / 9, 
  className, 
  rounded = false, 
  shadow = false,
  hover = false,
  border = false,
  children, 
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      "overflow-hidden",
      rounded && "rounded-lg",
      shadow && "shadow-md",
      hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      border && "border border-gray-200 dark:border-gray-800",
      className
    )}
    {...props}
  >
    <AspectRatio ratio={ratio}>
      {children}
    </AspectRatio>
  </div>
))

AspectRatioWrapper.displayName = "AspectRatioWrapper"

export { AspectRatio, AspectRatioWrapper }
