import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<div className="container mx-auto px-4 py-6">
				<div className="bg-white shadow-lg rounded-lg p-6">
					{children}
				</div>
			</div>
		</div>
	);
};

export default DashboardLayout;
