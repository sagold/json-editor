import path from 'node:path';
import fs from 'node:fs';
import { parse } from './parser/parse';

const docString = fs.readFileSync(path.join(process.cwd(), 'docs.json'), 'utf-8');
const doc = JSON.parse(docString.replace(/\n\s+\/\/.*/g, '')) as { parseFilepaths: string[] };
const apiData = parse(doc.parseFilepaths);
fs.writeFileSync(path.join(process.cwd(), 'docs', 'api2.json'), JSON.stringify(apiData, null, 2), 'utf-8');
