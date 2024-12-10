import { ReactNode } from 'react';
import { Icon } from '../components/icon/Icon';

export function getSections(icon: string | undefined, tag: string | undefined, swap = false) {
    let leftSection: ReactNode;
    let rightSection;
    if (icon) {
        if (swap) {
            rightSection = <Icon>{icon}</Icon>;
        } else {
            leftSection = <Icon>{icon}</Icon>;
        }
    }
    if (tag) {
        if (!swap) {
            rightSection = <span>{tag}</span>;
        } else {
            leftSection = <span>{tag}</span>;
        }
    }
    return [leftSection, rightSection];
}
