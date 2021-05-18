// @ts-nocheck
import Morphy from 'phpmorphy-locutus'

const morphy = new Morphy('en', {
	storage: Morphy.STORAGE_MEM,
	predict_by_suffix: true,
	predict_by_db: true,
	graminfo_as_text: true,
	use_ancodes_cache: false,
	resolve_ancodes: Morphy.RESOLVE_ANCODES_AS_TEXT
})

export const textToFrequencyVocabulary = (text): Words[] => {
	console.time('textToFrequencyVocabulary')

	const clarified = text
		.replace(/[0-9\.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’“”'";/⁄·\&*@\•^†‡°”¡¿※#№÷×ºª%‰+−=‱¶′″‴§~_|‖¦©℗®℠™¤₳฿₵¢₡₢$₫₯֏₠€ƒ₣₲₴₭₺₾ℳ₥₦₧₱₰£៛₽₹₨₪৳₸₮₩¥\s]+/gmi, ' ')
		.replace(/é/gmi, 'e')
		.trim()

	const words = clarified.split(' ')

	const freqVocMap = {}
	words.forEach(word => {
		const w = word.toLowerCase().replace(/<.*>/gim, '')
		freqVocMap[w] = freqVocMap[w] ? freqVocMap[w] + 1 : 1
	})


	console.time('morphy')
	Object.keys(freqVocMap).forEach(word => {
		const lowercaseOriginalWord = word.toLowerCase()
		const wordsLemmas = morphy.lemmatize(lowercaseOriginalWord)

		const lemmaWord = wordsLemmas && wordsLemmas[0].toLowerCase()

		if (lemmaWord === false) {
			// if no lemma - it's not a word
			delete freqVocMap[word]
		}

		if (lemmaWord !== lowercaseOriginalWord) {
			freqVocMap[lemmaWord] = freqVocMap[lemmaWord] ? freqVocMap[lemmaWord] + freqVocMap[word] : freqVocMap[word]

			delete freqVocMap[word]
		}
	})

	console.timeEnd('morphy')

	const freqVoc = Object.entries(freqVocMap)
		.map(([word, count]) => ({word, count, progress: 0}))
		.sort((a, b) => b.count - a.count)


	console.timeEnd('textToFrequencyVocabulary')

	return freqVoc
}