import { json } from '../../node/json';
import { set } from 'gson-pointer';
/**
 * @param node - node from which to retrieve basic data
 * @param pointerToValue - json-pointer from node to value
 * @param value
 * @returns data of node with changed value at given pointerToValue
 */
export function getUpdatedData(node, pointerToValue, value) {
    const data = json(node);
    set(data, pointerToValue, value);
    return data;
}
//# sourceMappingURL=getUpdatedData.js.map