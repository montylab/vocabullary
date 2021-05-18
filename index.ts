import {Vocabulary} from './Vocabulary'
import fs from 'fs-extra'

const text = fs.readFileSync('./gd_s1/3.srt').toString('utf-8')

const voc = new Vocabulary(text)
console.log(voc)

const cleaned = voc.clean()

console.log(cleaned.words, cleaned.words.length)

fs.writeFileSync('./out/3.txt', cleaned.words.map(w => w.word).join('\n'))