import style from './index.module.scss'
import Head from 'next/head'
import {SyntheticEvent, useState} from 'react'
import {Vocabulary} from '../logic/Vocabulary'


export default function Home() {
	const [freqVocs, setFreqVocs] = useState<Vocabulary[]>([])

	const fileChanged = (e: SyntheticEvent) => {
		const input = e.target as HTMLInputElement
		Array.from(input?.files).forEach(async (file) => {
			const text = await file.text()
			console.log(file, text)
			// const voc = textToFrequencyVocabulary(text) as Vocabulary[]
			//const voc = new Vocabulary(text)

			//setFreqVocs([...freqVocs, voc] as any)
		})
	}

	return (
		<div className={style.container}>
			<Head>
				<title>Vocabuller App</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>

			<main className={style.main}>
				<h1 className={style.title}>
					Welcome to Vocabuller
				</h1>

				<input type="file" onChange={fileChanged} multiple/>

				{freqVocs.map((voc) => {

				})}

			</main>
		</div>
	)
}
