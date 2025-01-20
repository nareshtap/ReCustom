import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { User } from "../../types/usersTypes";
import AddEditUserModal from "../AddEditUserModal";
import "@testing-library/jest-dom";

vi.mock("./CustomButton", () => ({
	__esModule: true,
	default: ({ label, onClick }: { label: string; onClick: () => void }) => (
		<button onClick={onClick}>{label}</button>
	),
}));

describe("AddEditUserModal", () => {
	const mockOnClose = vi.fn();
	const mockOnSave = vi.fn();

	const user: User = {
		id: 1,
		name: "user1",
		email: "user1@gmail.com",
		role: "user",
	};

	it("should render modal with empty fields when adding a user", () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		expect(screen.getByText("Add User")).toBeTruthy();

		expect(screen.getByLabelText(/Name/i)).toHaveValue("");
		expect(screen.getByLabelText(/Email/i)).toHaveValue("");
	});

	it("should render modal with user data when editing an existing user", () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
				user={user}
			/>
		);

		expect(screen.getByText("Edit User")).toBeInTheDocument();
		expect(screen.getByLabelText(/Name/i)).toHaveValue(user.name);
		expect(screen.getByLabelText(/Email/i)).toHaveValue(user.email);
	});

	it("should call onSave with form data when Save button is clicked", async () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "user1" },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "user1@gmail.com" },
		});

		fireEvent.click(screen.getByText("Save"));

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith({
				name: "user1",
				email: "user1@gmail.com",
				role: "user",
			});
		});

		expect(mockOnClose).toHaveBeenCalled();
	});

	it("should show validation errors if the form is invalid", async () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		fireEvent.click(screen.getByText("Save"));

		expect(
			await screen.findByText(/Name is required/i)
		).toBeInTheDocument();
		expect(
			await screen.findByText(/Email is required/i)
		).toBeInTheDocument();
	});

	it("should show error for invalid email format", async () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "invalid-email" },
		});

		fireEvent.click(screen.getByText("Save"));

		expect(
			await screen.findByText(/Invalid email format/i)
		).toBeInTheDocument();
	});

	it("should call onClose when Cancel button is clicked", () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		fireEvent.click(screen.getByText("Cancel"));

		expect(mockOnClose).toHaveBeenCalled();
	});

	it("should call onSave when Save button is clicked while adding a new user", async () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "New User" },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "newuser@example.com" },
		});

		fireEvent.click(screen.getByText("Save"));

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith({
				name: "New User",
				email: "newuser@example.com",
				role: "user",
			});
		});

		expect(mockOnClose).toHaveBeenCalled();
	});

	it("should update user details and call onSave with updated data when Save button is clicked while editing", async () => {
		render(
			<AddEditUserModal
				open={true}
				onClose={mockOnClose}
				onSave={mockOnSave}
				user={user}
			/>
		);

		expect(screen.getByText("Edit User")).toBeInTheDocument();
		expect(screen.getByLabelText(/Name/i)).toHaveValue(user.name);
		expect(screen.getByLabelText(/Email/i)).toHaveValue(user.email);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "Updated User" },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "updateduser@example.com" },
		});

		fireEvent.click(screen.getByText("Update"));

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith({
				name: "Updated User",
				email: "updateduser@example.com",
				role: "user",
			});
		});

		expect(mockOnClose).toHaveBeenCalled();
	});
});
