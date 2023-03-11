import axios from "axios";

const backendURL = import.meta.env.PUBLIC_BACKEND_URL;
if(backendURL){
	console.log(backendURL);
	axios.interceptors.request.use((config) => {
		config.baseURL = `${backendURL}/`
		return config;
	})
}


export function setJWTHeader(jwt: string){
	return axios.interceptors.request.use((config) => {
		config.headers.set("x-auth-key", jwt);
		return config;
	});
}

export function unsetJWTHeader(interceptor: number){
	axios.interceptors.request.eject(interceptor);
}
