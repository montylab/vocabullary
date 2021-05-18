import {Vocabulary} from '../../Vocabulary'

interface FreqVocabularyProps {
	name: string,
	vocabulary: Vocabulary
}

export default function FreqVocabulary({name, vocabulary}: FreqVocabularyProps) {

	return (
		<div className="freq-vocabulary">
			<h1>
				{name}
			</h1>

			<ul>
				{vocabulary.words.map((wordInstance) => (
					<li>{wordInstance.count}: {wordInstance.word}</li>
				))}

			</ul>


			<style jsx>{`
				.freq-vocabulary {
				  padding: 20px;
				  background: #d0d0d0;
				}
				
				h1 {
					font-size: 28px
				}
     `}</style>
		</div>
	)
}
