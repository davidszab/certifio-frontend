//@ts-nocheck
export default function Signatures({context}){
	return <div style={{border: "1px solid black"}}>
		<div style={{display: "flex", justifyContent: "space-around"}}>
			{context.signatures.sort((a, b) => a.order - b.order).map((e) => <div style={{border: "1px solid black",}}>
				{e.name}
				<br />
				{e.title}
			</div>)}
		</div>
	</div>
}