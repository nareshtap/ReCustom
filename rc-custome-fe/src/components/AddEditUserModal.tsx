import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";
import CustomButton from "./CustomButton";
import { User } from "../types/usersTypes";

interface AddEditUserModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (user: { name: string; email: string; role: string }) => void;
	user?: User | null;
}

const AddEditUserModal: React.FC<AddEditUserModalProps> = ({
	open,
	onClose,
	onSave,
	user,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "user",
	});

	const [errors, setErrors] = useState({
		name: "",
		email: "",
		role: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				role: user.role,
			});
		}
	}, [user]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | { name?: string; value: unknown }
		>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name as string]: value });

		setErrors((prevErrors) => ({
			...prevErrors,
			[name as string]: "",
		}));
	};

	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		setErrors((prevErrors) => ({
			...prevErrors,
			role: "",
		}));
	};

	const validateForm = () => {
		let valid = true;
		const newErrors = { name: "", email: "", role: "" };

		if (!formData.name.trim()) {
			newErrors.name = "Name is required.";
			valid = false;
		}

		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		if (!formData.email.trim()) {
			newErrors.email = "Email is required.";
			valid = false;
		} else if (!emailPattern.test(formData.email)) {
			newErrors.email = "Invalid email format.";
			valid = false;
		}

		if (!formData.role) {
			newErrors.role = "Role is required.";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			onSave(formData);
			onClose();
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
			<DialogContent>
				<TextField
					label="Name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={Boolean(errors.name)}
					helperText={errors.name}
				/>
				<TextField
					label="Email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={Boolean(errors.email)}
					helperText={errors.email}
				/>
				<FormControl
					fullWidth
					margin="normal"
					error={Boolean(errors.role)}
					data-testid="role-select"
				>
					<InputLabel>Role</InputLabel>
					<Select
						name="role"
						value={formData.role}
						onChange={handleSelectChange}
						label="Role"
					>
						<MenuItem value="user">User</MenuItem>
						<MenuItem value="admin">Admin</MenuItem>
					</Select>
					<FormHelperText>{errors.role}</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<CustomButton
					label="Cancel"
					onClick={onClose}
					color="secondary"
				/>
				<CustomButton
					label={user ? "Update" : "Save"}
					onClick={handleSubmit}
					color="primary"
				/>
			</DialogActions>
		</Dialog>
	);
};

export default AddEditUserModal;
