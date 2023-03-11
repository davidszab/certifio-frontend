import React from "react";
import Handlebars from "handlebars";
import Signatures from "../components/certificate/Signatures";

interface Template {
	type: string | React.ComponentType
	props?: {},
	children?: string | Template | Template[]
}

const customElements = [{
	key: "Signatures",
	component: Signatures
}]

function typeConverter(type: string | React.ComponentType){
	const index = customElements.findIndex((e) => e.key === type);
	if(index != -1)
		return customElements[index].component;
	return type;
}

//todo: change any
function templateToComponent({type, props, children}: Template, index?: string, ctx?: {}): any{
	type = typeConverter(type);
	if(Array.isArray(children))
		return React.createElement(type, {...props, key: index, context: ctx}, children.map((t,i) => {return templateToComponent(t, i.toString(), ctx)}));
	else if(typeof children == 'string')
		return React.createElement(type, {...props, key: index, context: ctx}, Handlebars.compile(children)(ctx));
	else if(typeof children == 'object')
		return React.createElement(type, {...props, key: index, context: ctx}, templateToComponent(children, "0", ctx));
	else if(!children)
		return React.createElement(type, {...props, key: index, context: ctx});
}

export {templateToComponent};
export type {Template};