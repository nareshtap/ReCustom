import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UserTable from "../UserTable";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { getAllUsers } from "../../services/userService";

vi.mock("../../services/userService", () => ({
	getAllUsers: vi.fn(),
	removeUser: vi.fn(),
	createUser: vi.fn(),
	updateUser: vi.fn(),
	downloadUserPdf: vi.fn(),
}));

describe("UserTable Component", () => {
	beforeEach(() => {
		vi.mocked(getAllUsers).mockResolvedValue({
			data: [
				{
					id: 1,
					name: "user1",
					email: "user1@gmail.com",
					role: "user",
					logins: 0,
					downloads: 0,
				},
				{
					id: 1,
					name: "user2",
					email: "user2@gmail.com",
					role: "admin",
					logins: 0,
					downloads: 0,
				},
			],
			meta: {
				currentPage: 0,
				nextPage: null,
				total: 2,
				remaining: 0,
			},
		});
	});

	it("should render without crashing", () => {
		render(
			<BrowserRouter>
				<UserTable />
			</BrowserRouter>
		);

		expect(screen.getByText("User Dashboard")).toBeTruthy();
	});

	it("should display a list of users", async () => {
		render(
			<BrowserRouter>
				<UserTable />
			</BrowserRouter>
		);

		const johnDoe = await screen.findByText("user1");
		const janeSmith = await screen.findByText("user2");

		expect(johnDoe).toBeInTheDocument();
		expect(janeSmith).toBeInTheDocument();
	});
});
