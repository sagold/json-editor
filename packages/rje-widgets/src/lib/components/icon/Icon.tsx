import classnames from 'classnames';

export type IconProps = {
    solid?: boolean;
    className?: string;
    children: string;
};

export function Icon({ solid, className, children }: IconProps) {
    return (
        <span className={classnames('rje-icon', solid ? 'rje-icon--solid' : 'rje-icon--outline', className)}>
            {children}
        </span>
    );
}
