import { EOL } from './utils/EOL';

/** renders a codeblock in the given language. Default: tsx */
export function codeBlock(code?: string, language: string = 'tsx') {
    return code ? ['', `\`\`\`${language}${EOL}${code}${EOL}\`\`\``, ''] : [];
}
