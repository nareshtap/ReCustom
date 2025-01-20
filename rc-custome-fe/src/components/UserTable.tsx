import React, { useState, useEffect, ChangeEvent } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import CustomButton from "./CustomButton";
import AddEditUserModal from "./AddEditUserModal";
import TablePagination from "@mui/material/TablePagination";
import { User } from "../types/usersTypes";
import {
	getAllUsers,
	removeUser,
	createUser,
	updateUser,
	downloadUserPdf,
} from "../services/userService";
import TableHeader from "./TableHeader";
import TableActions from "./TableActions";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import { debounce as _debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTable: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sortColumn, setSortColumn] = useState<string>("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [searchQuery, setSearchQuery] = useState<string>("");

	const navigate = useNavigate();

	const debouncedSearch = _debounce((query: string) => {
		setSearchQuery(query);
	}, 2000);

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const response = await getAllUsers(
				page + 1,
				rowsPerPage,
				sortColumn,
				sortDirection,
				searchQuery
			);
			setUsers(response.data);
			setTotal(response.meta.total);
		} catch (error: unknown) {
			toast.error(
				(error as any)?.response?.data?.message ||
					"Error fetching users!"
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [page, rowsPerPage, sortColumn, sortDirection, searchQuery]);

	const handleSort = (column: string) => {
		const isAsc = sortColumn === column && sortDirection === "asc";
		setSortColumn(column);
		setSortDirection(isAsc ? "desc" : "asc");
	};

	const handlePageChange = (
		_: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleAddUser = () => setModalOpen(true);

	const handleEdit = (user: User) => {
		setSelectedUser(user);
		setModalOpen(true);
	};

	const handleDelete = async (id: number) => {
		try {
			await removeUser(id);
			toast.success("User successfully deleted!");
			fetchUsers();
		} catch (error: unknown) {
			toast.error(
				(error as any)?.response?.data?.message ||
					"Error deleting user!"
			);
		}
	};

	const handleDownloadPDF = (id: number) => {
		downloadUserPdf(id);
	};

	const handleSave = async (user: Partial<User>) => {
		if (!user.name || !user.email) {
			toast.error("Name and Email are required!");
			return;
		}

		try {
			if (selectedUser) {
				await updateUser(selectedUser.id, user);
				toast.success("User successfully updated!");
			} else {
				await createUser(user);
				toast.success("User successfully created!");
			}
			setModalOpen(false);
			setSelectedUser(null);
			setPage(0);
			fetchUsers();
		} catch (error: unknown) {
			toast.error(
				(error as any)?.response?.data?.message || "Error saving user!"
			);
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(event.target.value);
	};

	const handlePreview = (id: number) => {
		navigate(`/users-matrix/${id}`);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">User Dashboard</h2>
				<CustomButton
					label="Add User"
					onClick={handleAddUser}
					icon={<AddIcon />}
				/>
			</div>

			<div className="mb-4 flex justify-end">
				<TextField
					label="Search"
					variant="outlined"
					onChange={handleSearchChange}
					className="sm:w-1/4 w-full"
				/>
			</div>

			{isLoading && (
				<div className="flex justify-center items-center py-4">
					<div className="animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12"></div>
				</div>
			)}

			{!isLoading && users.length === 0 && (
				<div className="flex justify-center items-center py-4">
					<p className="text-xl text-gray-500">No data available.</p>
				</div>
			)}

			<TableContainer component={Paper}>
				<Table>
					<thead>
						<TableHeader
							sortColumn={sortColumn}
							sortDirection={sortDirection}
							onSort={handleSort}
						/>
					</thead>
					<TableBody>
						{users.map((user) => (
							<TableActions
								key={user.id}
								user={user}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onDownload={handleDownloadPDF}
								onPreview={handlePreview}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={total}
				page={page}
				onPageChange={handlePageChange}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleRowsPerPageChange}
				rowsPerPageOptions={[5, 10, 25, 50]}
			/>

			{isModalOpen && (
				<AddEditUserModal
					open={isModalOpen}
					onClose={() => {
						setModalOpen(false);
						setSelectedUser(null);
					}}
					user={selectedUser}
					onSave={handleSave}
				/>
			)}

			<ToastContainer />
		</div>
	);
};

export default UserTable;
