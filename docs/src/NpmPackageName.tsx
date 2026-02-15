import { CSSProperties } from 'react';

const tagStyles: CSSProperties = {
    color: '#fff',
    padding: '0.03em 0.4em 0.05em 0.4em',
    fontSize: 'inherit',
    fontFamily: 'inherit'
};

export function NpmPackageName({ name }: { name: string }) {
    return (
        <div
            style={{
                fontFamily: 'Inter',
                display: 'inline-flex',
                fontWeight: 500,
                fontSize: '0.75em',
                lineHeight: 1.6,
                textShadow: '1px 1px 0 rgb(0,0,0,0.3)'
            }}
        >
            <span
                style={{
                    ...tagStyles,
                    background: 'rgb(90, 90 ,90)',
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                }}
            >
                npm
            </span>
            <span
                style={{
                    ...tagStyles,
                    background: 'rgba(236, 98, 167)',
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                }}
            >
                {name}
            </span>
        </div>
    );
}
