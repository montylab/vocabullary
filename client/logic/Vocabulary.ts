import {textToFrequencyVocabulary} from './helpers'

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
}