import SyntaxHighlighter from 'react-syntax-highlighter';
// import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';
import a11yLight from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-light';

export function Code({ children }: { children: string }) {
    return (
        <SyntaxHighlighter class="docs-code docs-code--simple" style={a11yLight} language={'ts'} PreTag="div">
            {children}
        </SyntaxHighlighter>
    );
}
