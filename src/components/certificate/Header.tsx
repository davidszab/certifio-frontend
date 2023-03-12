interface HeaderProps {
	title: string,
	img: string
}

const backendURL = import.meta.env["PUBLIC_BACKEND_URL"];

export default function Header({title, img}: HeaderProps){
	return <div className="certificate-header">
		<img src={`${backendURL}/storage/images/${img}`} />
		<h1>{title}</h1>
	</div>
}