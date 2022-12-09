import { Plugin } from '../HeadlessJsonEditor';
/**
 * prototypical plugin to support a dynamic enum for a schema like
 *
 * ```json
 * {
 *   type: "array",
 *   options: {
 *     syncEnum: {
 *       source: "#/pointer/to/string-list"
 *     }
 *   },
 *   items: {
 *     type: "string",
 *     enum: []
 *   }
 * }
 * ```
 */
export declare const RemoteEnumOptionsPlugin: Plugin;
