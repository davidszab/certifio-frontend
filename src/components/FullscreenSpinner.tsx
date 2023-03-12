import { Spin } from "antd";

export default function FullscreenSpinner() {
	return (
		<div
			style={{
				height: "calc(100vh - 200px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<Spin />
		</div>
	);
}
