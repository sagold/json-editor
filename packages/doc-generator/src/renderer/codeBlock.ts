import { EOL } from './utils/EOL';

/** renders a codeblock in the given language. Default: tsx */
export function codeBlock(code?: string, language: string = 'tsx') {
    return code ? ['', `\`\`\`${language}${EOL}${code}${EOL}\`\`\``, ''] : [];
}

/**
 * no copy button
 */
export function simpleCodeBlock(code?: string, language: string = 'tsx') {
    if (!code) return [];
    // Always wrap in a template literal so MDX never parses the content as JSX.
    // TypeScript generics (<N>), array types (string[]), block bodies ({}) and
    // template interpolations (${}) would all be misinterpreted otherwise.
    const escaped = code
        .replace(/\\/g, '\\\\') // backslash      → \\
        .replace(/`/g, '\\`') // backtick        → \`
        .replace(/\$\{/g, '\\${'); // ${interpolation} → \${
    return [`<Code>{\`${escaped}\`}</Code>`];
}
