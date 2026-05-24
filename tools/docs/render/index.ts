export const EOL = '\n';

/** renders a codeblock in the given language. Default: tsx */
export function codeBlock(code: string, language: string = 'tsx') {
    return code ? ['', `\`\`\`${language}${EOL}${code}${EOL}\`\`\``, ''] : [];
}
