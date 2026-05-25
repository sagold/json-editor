export function maybeAll(test?: any, ...contents: (string | null)[]) {
    return test ? contents : [];
}
