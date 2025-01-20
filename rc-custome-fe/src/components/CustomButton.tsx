import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
	label?: string;
	icon?: React.ReactNode;
	onClick: () => void;
	color?: "primary" | "secondary" | "success" | "error";
	variant?: "contained" | "outlined" | "text";
	size?: "small" | "medium" | "large";
	className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
	label,
	icon,
	color,
	onClick,
	className,
}) => (
	<Button
		onClick={onClick}
		style={{ backgroundColor: color }}
		className={className}
	>
		{icon && <span>{icon}</span>}
		{label && <span>{label}</span>}
	</Button>
);

export default CustomButton;
