import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const AnimatedProgressBar = ({
	value,
	max,
	duration = 1000,
	delay = 0,
	...props
}) => {
	const [currentValue, setCurrentValue] = useState(0);
	const [animationStarted, setAnimationStarted] = useState(false);

	useEffect(() => {
		const startTimer = setTimeout(() => {
			setAnimationStarted(true);
		}, delay);

		return () => clearTimeout(startTimer);
	}, [delay]);

	useEffect(() => {
		if (!animationStarted) return;

		const timer = setTimeout(() => {
			setCurrentValue(value);
		}, 100);

		return () => clearTimeout(timer);
	}, [value, animationStarted]);

	useEffect(() => {
		if (!animationStarted) return;

		const stepTime = Math.abs(Math.floor(duration / value));
		if (currentValue !== value) {
			const timer = setTimeout(() => {
				setCurrentValue((prevValue) => {
					const newValue = prevValue + (value > prevValue ? 1 : -1);
					return value > prevValue
						? Math.min(newValue, value)
						: Math.max(newValue, value);
				});
			}, stepTime);

			return () => clearTimeout(timer);
		}
	}, [value, currentValue, duration, animationStarted]);

	return <Progress value={currentValue} max={max} {...props} />;
};

export default AnimatedProgressBar;
