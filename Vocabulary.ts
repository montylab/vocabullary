import {textToFrequencyVocabulary} from './helpers'
import fs from "fs-extra"

console.time('process')

interface Word {
	word: string,
	progress: number,
	count: number
}

export class Vocabulary {
	words: Word[] = []

	constructor(wordsOrString: string | Word[]) {
		const  tempVoc = typeof wordsOrString === 'string'
			? textToFrequencyVocabulary(wordsOrString)
			: wordsOrString

		tempVoc.forEach((wordInstance) => this.addWord(wordInstance))
	}

	addWord(wordInstance: Word) {
		const lowercased = wordInstance.word.toLowerCase()

		if (!this.wordExists(lowercased)) {
			this.words.push({
				word: lowercased,
				progress: wordInstance.progress || 0,
				count: wordInstance.count || 0
			})
		}
	}

	getWordInstanceByWord(wordToFind: string | Word) {
		let findBy = typeof wordToFind === 'object' ? wordToFind.word :  wordToFind
		const lowercased = findBy.toLowerCase()

		return this.words.find(({word} ) => word === lowercased)
	}

	wordExists(word: string | Word) {
		return this.getWordInstanceByWord(word)
	}

	mergeWithVocabulary(vocabulary: Vocabulary)  {
		//todo: merge strategies
		vocabulary.words.forEach((wordInstance) => {
			const existedWordInstance = this.getWordInstanceByWord(wordInstance.word)
			if (existedWordInstance) {
				existedWordInstance.progress  = Math.max(wordInstance.progress, existedWordInstance.progress)
			} else {
				this.words.push(wordInstance)
			}
		})

		return this
	}

	subtractVocabulary(vocabulary: Vocabulary) {
		this.words = this.getDiffVocabulary(vocabulary)
		return this
	}

	getDiffVocabulary(vocabulary: Vocabulary)  {
		return this.words.filter((w) => !vocabulary.wordExists(w))
	}

	clean() {
		this.words = this.words.filter(({word}) => word.length > 2)

		return this
			.subtractVocabulary(VOCABULARIES.excess)
			.subtractVocabulary(VOCABULARIES.boys)
			.subtractVocabulary(VOCABULARIES.girls)
			.subtractVocabulary(VOCABULARIES.surnames)
			.subtractVocabulary(VOCABULARIES.top3000)
			.subtractVocabulary(VOCABULARIES.GD1)
			.subtractVocabulary(VOCABULARIES.GD2)
			// .subtractVocabulary(VOCABULARIES.GD3)
	}
}

const openVoc = (name: string): Word[] => fs
	.readFileSync(`./vocs/${name}.txt`)
	.toString('utf-8')
	.split('\n')
	.map((word) => ({word, count: 0, progress: 4}))

console.time('open vocs')
const VOCABULARIES = {
	excess: new Vocabulary(openVoc('excess')),
	top3000: new Vocabulary(openVoc('top-3000')),
	girls: new Vocabulary(openVoc('girl-names')),
	boys: new Vocabulary(openVoc('boy-names')),
	surnames: new Vocabulary(openVoc('surnames')),

	GD1: new Vocabulary(openVoc('1')),
	GD2: new Vocabulary(openVoc('2')),
	// GD3: new Vocabulary(openVoc('3')),
}
console.timeEnd('open vocs')


console.timeEnd('process')



