//@ts-nocheck
export default function Signatures({ context }) {
	const backendURL = import.meta.env["PUBLIC_BACKEND_URL"];
	return (
		<div className="certificate-signatures">
			{context.signatures
				.sort((a, b) => a.order - b.order)
				.map((e, i) => (
					<div key={i}>
						<img src={`${backendURL}/storage/images/signatures/${e.img}`} alt="" />
						<h3>{e.name}</h3>
						<h4>{e.title}</h4>
					</div>
				))}
		</div>
	);
}
