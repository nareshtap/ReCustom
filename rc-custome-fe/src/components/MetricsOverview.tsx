import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useParams, useNavigate } from "react-router-dom";
import { getUserActivityMetrics } from "../services/userService";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CustomButton from "../components/CustomButton";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface UserMetrics {
	downloads: number;
	logins: number;
}

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

interface ChartData {
	labels: string[];
	datasets: {
		data: number[];
		backgroundColor: string[];
	}[];
}

const MetricsOverview: React.FC = () => {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [data, setData] = useState<ChartData | null>(null);
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!userId) {
				setError("User ID is required.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const response = await getUserActivityMetrics(Number(userId));
				setUserInfo(response.user);

				const metrics: UserMetrics = response.metrics;
				setData({
					labels: ["Downloads", "Logins"],
					datasets: [
						{
							data: [metrics.downloads, metrics.logins],
							backgroundColor: ["#3b82f6", "#10b981"],
						},
					],
				});
			} catch (err) {
				setError("Failed to fetch metrics.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [userId]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
				<div className="text-center text-xl font-semibold text-red-500 mb-4">
					{error}
				</div>

				<CustomButton
					icon={<KeyboardBackspaceIcon />}
					label="Go Back"
					color="primary"
					variant="contained"
					onClick={() => navigate("/")}
				/>
			</div>
		);
	}

	const noDataAvailable =
		data &&
		data.datasets[0].data[0] === 0 &&
		data.datasets[0].data[1] === 0;

	return (
		<div className="p-6 bg-white shadow rounded-md space-y-6">
			<div className="mb-4">
				<CustomButton
					icon={<KeyboardBackspaceIcon />}
					label="User Dashboard"
					color="primary"
					variant="contained"
					onClick={() => navigate("/")}
				/>
			</div>

			<div className="flex justify-center items-center mb-4">
				<h2 className="text-2xl font-semibold text-center">
					User Matrix Preview
				</h2>
			</div>

			{userInfo && (
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold">{userInfo.name}</h2>
					<p className="text-gray-600">Role: {userInfo.role}</p>
					<p className="text-gray-600">Email: {userInfo.email}</p>
				</div>
			)}

			{noDataAvailable ? (
				<div className="flex justify-center items-center h-[300px] text-center text-gray-600 font-medium">
					No chart data available (Downloads and Logins are both 0).
				</div>
			) : (
				<div className="flex justify-center h-[400px]">
					{data && <Pie data={data} />}
				</div>
			)}

			{userInfo && !noDataAvailable && (
				<div className="space-y-4">
					<div className="flex text-lg font-medium gap-1">
						<span>Downloads: </span>
						<span>{data?.datasets[0].data[0] || 0}</span>
					</div>
					<div className="flex text-lg font-medium gap-1">
						<span>Logins: </span>
						<span>{data?.datasets[0].data[1] || 0}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default MetricsOverview;
