import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

interface TableHeaderProps {
	sortColumn: string;
	sortDirection: "asc" | "desc";
	onSort: (column: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
	sortColumn,
	sortDirection,
	onSort,
}) => {
	return (
		<TableRow>
			<TableCell
				align="center"
				sortDirection={sortColumn === "name" ? sortDirection : false}
			>
				<TableSortLabel
					active={sortColumn === "name"}
					direction={sortColumn === "name" ? sortDirection : "asc"}
					onClick={() => onSort("name")}
				>
					Name
				</TableSortLabel>
			</TableCell>
			<TableCell
				align="center"
				sortDirection={sortColumn === "email" ? sortDirection : false}
			>
				<TableSortLabel
					active={sortColumn === "email"}
					direction={sortColumn === "email" ? sortDirection : "asc"}
					onClick={() => onSort("email")}
				>
					Email
				</TableSortLabel>
			</TableCell>
			<TableCell
				align="center"
				sortDirection={sortColumn === "role" ? sortDirection : false}
			>
				<TableSortLabel
					active={sortColumn === "role"}
					direction={sortColumn === "role" ? sortDirection : "asc"}
					onClick={() => onSort("role")}
				>
					Role
				</TableSortLabel>
			</TableCell>
			<TableCell
				align="center"
				sortDirection={sortColumn === "logins" ? sortDirection : false}
			>
				<TableSortLabel
					active={sortColumn === "logins"}
					direction={sortColumn === "logins" ? sortDirection : "asc"}
					onClick={() => onSort("logins")}
				>
					Total Logins
				</TableSortLabel>
			</TableCell>
			<TableCell
				align="center"
				sortDirection={
					sortColumn === "downloads" ? sortDirection : false
				}
			>
				<TableSortLabel
					active={sortColumn === "downloads"}
					direction={
						sortColumn === "downloads" ? sortDirection : "asc"
					}
					onClick={() => onSort("downloads")}
				>
					Downloads
				</TableSortLabel>
			</TableCell>
			<TableCell align="center">Actions</TableCell>
		</TableRow>
	);
};

export default TableHeader;
