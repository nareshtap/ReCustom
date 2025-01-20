import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CustomButton from "./CustomButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { User } from "../types/usersTypes";

interface TableActionsProps {
	user: User;
	onEdit: (user: User) => void;
	onDelete: (id: number) => void;
	onDownload: (id: number) => void;
	onPreview: (id: number) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
	user,
	onEdit,
	onDelete,
	onDownload,
	onPreview,
}) => {
	return (
		<TableRow>
			<TableCell align="center">{user.name}</TableCell>
			<TableCell align="center">{user.email}</TableCell>
			<TableCell align="center">{user.role}</TableCell>
			<TableCell align="center">{user.logins}</TableCell>
			<TableCell align="center">{user.downloads}</TableCell>
			<TableCell align="center">
				<CustomButton
					icon={<EditIcon />}
					color="primary"
					onClick={() => onEdit(user)}
				/>
				<CustomButton
					icon={<DeleteIcon />}
					color="error"
					onClick={() => onDelete(user.id)}
				/>
				<CustomButton
					icon={<DownloadIcon />}
					color="success"
					onClick={() => onDownload(user.id)}
				/>
				<CustomButton
					icon={<VisibilityIcon />}
					color="success"
					onClick={() => onPreview(user.id)}
				/>
			</TableCell>
		</TableRow>
	);
};

export default TableActions;
