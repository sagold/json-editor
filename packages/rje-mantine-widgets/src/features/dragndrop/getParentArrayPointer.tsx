export function getParentArrayPointer(element: HTMLElement) {
    let parent = element.parentElement;
    while (parent != null && parent !== document.body) {
        if (parent.getAttribute('data-type') === 'array') {
            return parent.getAttribute('data-id');
        }
        parent = parent.parentElement;
    }
    console.error('array widget failed resolving target pointer of', element);
    return undefined;
}
