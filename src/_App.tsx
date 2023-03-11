import React, { useEffect, useState } from 'react'
import {Template, templateToComponent} from "./lib/template";

const templatePayload: Template[] = [
	{
		type: "div",
		props: {
			style: {
				display: "flex"
			}
		},
		children: [
			{
				type: "h1",
				children: "{{name}}"
			},
			{
				type: "img",
				props: {
					src: "/vite.svg"
				}
			}
		]
	},
	{
		type: "h2",
		children: "Amely tanúsítja, hogy"
	},
	{
		type: "h1",
		children: "{{name}}"
	},
	{
		type: "h3",
		children: "Budapest körzet diákjaként a 2022/2023-as tanév csereprogramja során sikeresen teljesítette az Utazási vizsga megszerzéséhez szükséges követelményeket, ezzel  kiérdemelve az országon belüli önálló utazás jogát."
	},
	{
		type: "h3",
		children: "2023. februar 21."
	},
	{
		type: "h3",
		children: "Gratulalunk!"
	}
]

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState<Template[]>([]);

  useEffect(() => {
	setTimeout(() => {
		setData(templatePayload);
	}, 250);
  }, []);

  return (
    <div className="App">
	<div>
		<div>
			{data.map((t, i) => templateToComponent(t, i.toString(), {name: "Szabó Dávid Szilárd"}))}
		</div>
	</div>
    </div>
  )
}

export default App
