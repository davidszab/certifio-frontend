import { Row, Col, Card, Collapse, Table } from "antd";
import { useNavigation, useSearchParams } from "react-router-dom";
import { useInfo } from "../lib/info";
const { Panel } = Collapse;
import { useRef } from "react";

function OwnerDataTable() {
	const { owner } = useInfo();
	const datasource: {name: string, value: string | JSX.Element, key: string}[] = [{ name: "Név", value: owner.name, key: "dName" }];
	if (owner.address) {
		datasource.push({
			name: "Cím",
			key: "dAddress",
			value: `${owner.address.postalCode} ${owner.address.city} ${owner.address.street} (${owner.address.country})`
		});
	}
	if (owner.contact) {
		datasource.push({
			name: "Kapcsolattartó",
			key: "dContact",
			value: (
				<a href={`mailto:${owner.contact.email}`}>
					{owner.contact.name} ({owner.contact.email})
				</a>
			)
		});
	}
	if (owner.website) {
		datasource.push({
			name: "Honlap",
			key: "dWebsite",
			value: <a href={owner.website}>{owner.website}</a>
		});
	}
	return (
		<Table
			title={() => <b>Az üzemeltető, adatkezelő adatai:</b>}
			columns={[{ dataIndex: "name", key: "name" }, { dataIndex: "value", key: "value" }]}
			dataSource={datasource}
			pagination={false}
			showHeader={false}
			bordered
			scroll={{x: true}}
		/>
	);
}

const userQuestions = [
	{
		question: "Mi az a Certifio?",
		answer: (
			<p>
				Certifio egy nyílt forráskódú{" "}
				<b>oklevélkiadó és -nyilvántartó rendszer</b>, amely modern webes
				technológiákra épül.
			</p>
		)
	},
	{
		question: "Hogyan kell használni a rendszert?",
		answer: (
			<p>
				Ha Önnek oklevelet állítottak ki a Certifio rendszerben, akkor arról
				email üzenetben fog értesülni. Az email tartalmazni fogja az oklevél
				adatait és egy hivatkozást, amelyre kattintva megtekintheti oklevelét.
				Ha több oklevéllel rendelkezik, akkor úgynevezett „Email alapú
				azonosítást” követően megtekintheti az összes oklevelét, valamint a
				rendszerben tárolt személyes adatait.
			</p>
		)
	},
	{
		question: "Milyen adatokat tárol a rendszer?",
		answer: (
			<>
				<p>
					A rendszer a felhasználókról minimális mennyiségű adatot tárol
					(vezetéknév, keresztnév, email-cím), azonban az adatkezelést a
					rendszer üzemeltetője végzi, és általánosan kijelenthető, hogy a
					Certifio rendszeren kívül is folytat adatkezelést.
				</p>
				<p>
					Az adatkezeléssel kapcsolatos kérdésekkel keresse a rendszer
					üzemeltetőjét!
				</p>
			</>
		)
	},
	{
		question: "Ki az üzemeltető, adatkezelő?",
		answer: (
			<>
				<p>
					A rendszer üzemeltetését, illetve az adatok kezelését az alábbi fél
					végzi.
				</p>
				<OwnerDataTable />
			</>
		)
	}
];

const projectQuestions = [
	{
		question: "Miért érdemes használni a Certifio-t?",
		answer: (
			<p>
				A Certifio segítségével könnyedén adhat ki okleveleket, amelyek
				motivációt jelenthetnek tanulói, munkavállalói számára.
			</p>
		)
	},
	{
		question: "Mennyibe kerül a Certifio használata?",
		answer: (
			<p>
				A Certifio használata ingyenes, azonban a felhasználóknak saját maguknak
				kell gondoskodniuk a rendszer üzemeltetéséről. A jövőben tervezünk
				elindítani egy menedzselt Software as a Service konstrukciót is, amely
				az üzemeltetési feladatokat leemelné a felhasználók válláról előre
				meghatározott havi díjas ellenében.
			</p>
		)
	},
	{
		question: "Milyen technológiákra épül a Certifio?",
		answer: (
			<>
				<p>
					A Certifio backend rendszere Node.js alapokon nyugszik és az alábbi
					nyílt forráskódú könyvtárakat használja: Express.js, Prisma,
					Handlebars, Nodemailer, TypeScript
				</p>
				<p>
					A Certifio frontend rendszere React.js alapokon nyugszik és az alábbi
					nyílt forráskódú könyvtárakat és technológiákat használja: Ant Design,
					React Router, Axios, Iconify, Vite, TypeScript
				</p>
			</>
		)
	},
	{
		question: "Milyen típusú okleveleket lehet kiállítani a Certifio-val?",
		answer: (
			<p>
				A Certifioval különböző típusú okleveleket lehet kiállítani, beleértve
				az akadémiai és szakmai okleveleket, a tanfolyamok és tréningek
				befejezését igazoló okleveleket, a nyelvvizsga okleveleket és a
				különféle tanúsítványokat. Az oklevelekhez sablonul szolgáló
				oklevéltörzseket saját igényeire szabhatja.
			</p>
		)
	}
];

export default function About() {
	const [searchParams, setSearchParams] = useSearchParams();
	const contactSelected = searchParams.has("contact");
	return (
		<Row gutter={[16, 32]} justify={"center"}>
			<Col xs={24} md={18} lg={16} xl={12}>
				<Card title="A rendszerről">
					<p>
						Ezen az oldalon megtalálja a rendszerrel kapcsolatos gyakran
						felmerülő kérdéseket és azokra adott átfogó válaszainkat.
					</p>
					<h1>Kérdések a rendszer használatáról</h1>
					<Collapse defaultActiveKey={contactSelected ? userQuestions.length - 1 : undefined}>
						{userQuestions.map((q, i) => (
							<Panel header={q.question} key={i}>
								{q.answer}
							</Panel>
						))}
					</Collapse>
					<h1 style={{marginTop: "1rem"}}>Kérdések a Certifio projektről</h1>
					<Collapse>
						{projectQuestions.map((q, i) => (
							<Panel header={q.question} key={i}>
								{q.answer}
							</Panel>
						))}
					</Collapse>
				</Card>
			</Col>
		</Row>
	);
}
