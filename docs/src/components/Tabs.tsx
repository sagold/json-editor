import { ReactElement, ReactNode, useState } from 'react';

interface TabProps {
    tabTitle: string;
    children: ReactNode;
}

export function Tabs({ children }: { children: ReactElement<TabProps> | ReactElement<TabProps>[] }) {
    const [tabIndex, setTabIndex] = useState(0);

    const tabs = Array.isArray(children) ? children : [children];

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
                {tabs.map((child, index) => (
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
            {tabs.map((child, index) => (
                <div key={index} style={{ display: index === tabIndex ? 'block' : 'none' }}>
                    {child}
                </div>
            ))}
        </div>
    );
}
