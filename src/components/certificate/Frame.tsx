//@ts-nocheck
import "../../styles/certificate.css";

export default function Frame({children}: {children?: JSX.Element | JSX.Element[]}){
	return <div className="certificate-frame print">
		<div className="certificate-content">
			{children}
		</div>
	</div>
}