export function classNames(...names) {
    const className = names.flat(1);
    return className.filter((v) => typeof v === 'string').join(' ');
}
//# sourceMappingURL=classNames.js.map