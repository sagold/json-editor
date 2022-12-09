import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Segment, Header } from 'semantic-ui-react';
import { split } from 'gson-pointer';
import { classNames } from '../../classNames';
function getNodeDepth(node, max = 4) {
    const depth = split(node.pointer).length;
    return Math.min(max, depth + 1);
}
export function ParentHeader({ node, icon, options, children }) {
    var _a;
    const inverted = ((_a = options.header) === null || _a === void 0 ? void 0 : _a.inverted) === true;
    const { title, description, header = {} } = options;
    const depth = getNodeDepth(node);
    if (!title && !description && !icon && !children) {
        return _jsx(_Fragment, {});
    }
    return (_jsx("div", { className: "ed-header", children: _jsxs(Segment, { basic: true, clearing: true, inverted: inverted, color: header === null || header === void 0 ? void 0 : header.color, className: classNames(icon && 'with-icon', description && 'with-description'), children: [_jsxs(Header, { as: `h${depth}`, inverted: inverted, floated: "left", children: [icon && _jsx(Header.Content, { floated: "left", children: icon }), _jsx(Header.Content, { children: title }), description && _jsx(Header.Subheader, { children: description })] }), children && (_jsx("div", { className: "ed-header__actions", style: { float: 'right' }, children: children }))] }) }));
}
//# sourceMappingURL=ParentHeader.js.map