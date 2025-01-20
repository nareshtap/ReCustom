import { Grid } from "@mui/material";
import UserTable from "../components/UserTable";

const Dashboard: React.FC = () => {
	return (
		<Grid container spacing={3} className="p-6">
			<Grid item xs={12}>
				<UserTable />
			</Grid>
		</Grid>
	);
};

export default Dashboard;
