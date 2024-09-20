import React, { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressBarProps
  extends React.ComponentProps<typeof Progress> {
  value: number;
  max: number;
  duration?: number;
  delay?: number;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  max,
  duration = 1000,
  delay = 0,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      if (progressRef.current) {
        observer.unobserve(progressRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTimer = setTimeout(() => {
      const stepTime = duration / value;
      let currentStep = 0;

      const intervalId = setInterval(() => {
        if (currentStep < value) {
          setCurrentValue(currentStep + 1);
          currentStep++;
        } else {
          clearInterval(intervalId);
        }
      }, stepTime);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [isVisible, value, duration, delay]);

  return (
    <div ref={progressRef}>
      <Progress value={currentValue} max={max} {...props} />
    </div>
  );
};

export default AnimatedProgressBar;
