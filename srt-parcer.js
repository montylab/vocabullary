const fs = require('fs')
const Morphy = require('phpmorphy-locutus').default
const morphy = new Morphy('en', {
	storage: Morphy.STORAGE_MEM,
	predict_by_suffix: true,
	predict_by_db: true,
	graminfo_as_text: true,
	use_ancodes_cache: false,
	resolve_ancodes: Morphy.RESOLVE_ANCODES_AS_TEXT
})

const textToFrequencyVoc = (text) => {
	const clarified = text
		.replace(/[0-9\.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’“”'";/⁄·\&*@\•^†‡°”¡¿※#№÷×ºª%‰+−=‱¶′″‴§~_|‖¦©℗®℠™¤₳฿₵¢₡₢$₫₯֏₠€ƒ₣₲₴₭₺₾ℳ₥₦₧₱₰£៛₽₹₨₪৳₸₮₩¥\s]+/gmi, ' ')
		.replace(/é/gmi, 'e')
		.trim()

	const words = clarified.split(' ')
	const freqVocMap = {}
	words.forEach(word => {
		if (word.length > 2) {
			const w = word.toLowerCase()
			freqVocMap[w] = freqVocMap[w] ? freqVocMap[w] + 1 : 1
		}
	})

	Object.keys(freqVocMap).forEach(word => {
		const lowercaseOriginalWord = word.toLowerCase()
		const wordsLemmas = morphy.lemmatize(lowercaseOriginalWord)

		const lemmaWord = wordsLemmas && wordsLemmas[0].toLowerCase()
		if (lemmaWord !== lowercaseOriginalWord) {
			freqVocMap[lemmaWord] = freqVocMap[lemmaWord] ? freqVocMap[lemmaWord] + freqVocMap[word] : freqVocMap[word]

			delete freqVocMap[word]
		}
	})



	const freqVoc = Object.entries(freqVocMap)
		.map(([word, count]) => ({word, count}))
		.sort((a, b) => b.count - a.count)


	return freqVoc
}

const subtractWords = (voc, words) => {
	return voc.filter(wordObject => {
		return !words.includes(wordObject.word.toLowerCase())
	})
}

const text = fs.readFileSync('./good-doctor.srt').toString('utf-8')

const vocTop3000 = fs.readFileSync('./vocs/top-3000.txt').toString('utf-8').split('\n')
const vocExcess = fs.readFileSync('./vocs/excess.txt').toString('utf-8').split('\n')
const vocGirls = fs.readFileSync('./vocs/girl-names.txt').toString('utf-8').split('\n')
const vocBoys = fs.readFileSync('./vocs/boy-names.txt').toString('utf-8').split('\n')
const vocLastnames = fs.readFileSync('./vocs/lastnames.txt').toString('utf-8').split('\n')

const voc = textToFrequencyVoc(text)

console.log(voc, voc.length)

const subtractedWords = subtractWords(voc, [...vocTop3000, ...vocExcess, ...vocGirls, ...vocBoys, ...vocLastnames])
console.log(subtractedWords, subtractedWords.length)

// const csv = subtractedWords.map(w => `${w.word},${w.word}`).join('\n')

fs.writeFileSync('./out-srt.csv', subtractedWords.map(w => w.word).join('\n'))