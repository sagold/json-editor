import { ReactElement, ReactNode, useState } from 'react';

export function Tabs({ children }: { children: ReactElement[] }) {
    const [tabIndex, setTabIndex] = useState(0);

    if (!Array.isArray(children)) {
        children = [children];
    }

    return (
        <div>
            <ul
                style={{
                    display: 'flex',
                    listStyle: 'none',
                    margin: 0,
                    gap: 8,
                    padding: 0,
                    alignItems: 'center',
                    border: '1px solid #fff'
                }}
            >
                {children.map((child, index) => (
                    <li
                        key={`${index} - ${child.props.tabTitle}`}
                        onClick={() => setTabIndex(index)}
                        style={{
                            cursor: tabIndex === index ? '' : 'pointer',
                            backgroundColor:
                                // tabIndex === index ? 'var(--mantine-color-gray-0, hsla(203, 50 %, 30 %, 0.05))' : '',
                                tabIndex === index ? 'var(--mantine-primary-color-1, hsla(203, 50 %, 30 %, 0.05))' : '',
                            // fontWeight: tabIndex === index ? 'bold' : '',
                            textDecoration: tabIndex === index ? '' : 'underline',
                            padding: '4px 12px',
                            margin: 0,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4
                        }}
                    >
                        {child.props.tabTitle}
                    </li>
                ))}
            </ul>
            {children.map((child, index) => (
                <div style={{ display: index === tabIndex ? 'block' : 'none' }}>{child}</div>
            ))}
        </div>
    );
}
