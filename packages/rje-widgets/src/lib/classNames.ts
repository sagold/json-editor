export function classNames(...names: (unknown | unknown[])[]) {
    const className = names.flat(1);
    return className.filter((v) => typeof v === 'string').join(' ');
}
