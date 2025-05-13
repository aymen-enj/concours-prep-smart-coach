
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  theme?: "light" | "dark";
}

interface BannerCarouselProps {
  slides: BannerSlide[];
  autoplay?: boolean;
  interval?: number;
  indicators?: boolean;
  controls?: boolean;
  className?: string;
}

export function BannerCarousel({
  slides,
  autoplay = true,
  interval = 5000,
  indicators = true,
  controls = true,
  className
}: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Handle automatic slideshow
  useEffect(() => {
    if (!autoplay || isHovering || slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length, isHovering]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="relative flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className="shrink-0 w-full h-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
            
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h2>
              {slide.subtitle && (
                <p className="text-sm md:text-base mb-4 max-w-md">{slide.subtitle}</p>
              )}
              {slide.buttonText && slide.buttonLink && (
                <Button asChild size="sm" variant={slide.theme === "dark" ? "outline" : "default"}>
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      {controls && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-30 transition-colors duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-30 transition-colors duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {indicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
