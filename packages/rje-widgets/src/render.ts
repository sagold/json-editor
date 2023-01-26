/**
 * Renders data into a string by {{variables}}.
 * Given a template string, removes all {{property}} substrings and replaces them with the property in the given data
 *
 * @param template - template string containing variables in handelbars/mustache style
 * @param data - flat object containing properties matching variables
 * @return rendered string
 */
export function render(template: string, data: { [p: string]: any } = {}): string {
    // eslint-disable-next-line prefer-named-capture-group
    return template.replace(/{{(\w+)}}/g, (match: string, property: string) => data[property]);
}
