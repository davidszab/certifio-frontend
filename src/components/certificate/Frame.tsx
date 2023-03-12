//@ts-nocheck
import "../../styles/certificate.css";

export default function Frame({children, frameColor}: {children?: JSX.Element | JSX.Element[], frameColor: string}){
	return <div className="certificate-frame print" style={{background: frameColor}}>
		<div className="certificate-content">
			{children}
		</div>
	</div>
}