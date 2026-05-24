import './tabs.scss';
import { ReactElement, ReactNode, useState } from 'react';

interface TabProps {
    tabTitle: string;
    children: ReactNode;
}

export function Tabs({ children }: { children: ReactElement<TabProps> | ReactElement<TabProps>[] }) {
    const [tabIndex, setTabIndex] = useState(0);

    const tabs = Array.isArray(children) ? children : [children];

    return (
        <div className="rje-docs-tabs">
            <ul>
                {tabs.map((child, index) => (
                    <li
                        className={tabIndex === index ? 'rje-docs-tab rje-docs-tab--active' : 'rje-docs-tab'}
                        key={`${index} - ${child.props.tabTitle}`}
                        onClick={() => setTabIndex(index)}
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
