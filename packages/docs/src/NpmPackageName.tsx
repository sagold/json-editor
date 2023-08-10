export function NpmPackageName({ name }) {
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
                    background: 'rgb(90, 90 ,90)',
                    color: '#fff',
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    padding: '0.05em 0.4em',
                    fontSize: 'inherit',
                    fontFamily: 'inherit'
                }}
            >
                npm
            </span>
            <span
                style={{
                    background: 'rgba(236, 98, 167)',
                    color: '#fff',
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    padding: '0.05em 0.4em',
                    fontSize: 'inherit',
                    fontFamily: 'inherit'
                }}
            >
                {name}
            </span>
        </div>
    );
}
