import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Button, Message, Input, Icon, Label, Item } from 'semantic-ui-react';
import { widget } from '../decorators';
import { render } from '../../../render';
import { deepEqual } from 'fast-equals';
import { useState } from 'react';
const isFile = (v) => Object.prototype.toString.call(v) === '[object File]';
const MIME_TO_ICON = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file word',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'file powerpoint',
    'text/csv': 'file excel',
    'text/plain': 'file text',
    'text/html': 'file code',
    'application/zip': 'file archive',
    'application/pdf': 'file pdf',
    'application/json': 'file code',
    'video/mp4': 'file video',
    'image/png': 'file image',
    'image/jpeg': 'file image',
    'image/gif': 'file image' // .gif
};
function getFileIcon(file) {
    if (MIME_TO_ICON[file.type]) {
        return MIME_TO_ICON[file.type];
    }
    if (file.type.startsWith('image')) {
        return 'file image';
    }
    if (file.type.startsWith('video')) {
        return 'file video';
    }
    if (file.type.startsWith('text')) {
        return 'file text';
    }
    console.log('unknown file type', file.type);
    return 'file';
}
function isImageFile(file) {
    return file.type.startsWith('image');
}
async function getDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt) => { var _a; return resolve((_a = evt === null || evt === void 0 ? void 0 : evt.target) === null || _a === void 0 ? void 0 : _a.result); };
        reader.onerror = reject;
    });
}
/**
 * @todo note that files cannot be on root because the tree will be recreated
 * and then an object is created. this has to be support thouroughly. Until then,
 * single files using strings do work.
 */
export const FileWidget = widget(({ node, options, setValue }) => {
    var _a;
    const { value } = node;
    const { disabled, imageUrlTemplate, downloadUrlTemplate } = options;
    const [imageData, setImageData] = useState();
    let status = 'empty';
    if (isFile(value) && imageData) {
        status = 'imageData';
    }
    else if (isFile(value)) {
        status = 'file';
    }
    else if (typeof value === 'string' && (value === null || value === void 0 ? void 0 : value.length) > 0) {
        status = 'filename';
    }
    async function setFile(file) {
        setValue(file);
        if (isImageFile(file)) {
            const dataUrl = await getDataUrl(file);
            dataUrl && setImageData(dataUrl);
        }
    }
    function change(event) {
        const files = event.target.files;
        if (files != null) {
            setFile(files[0]);
        }
    }
    function drop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files != null) {
            setFile(files[0]);
        }
    }
    function reset() {
        setValue('');
        imageData && setImageData(undefined);
    }
    const resetButton = (_jsx(Button, { icon: "trash", style: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: 16,
            zIndex: 19
        }, disabled: options.readOnly || disabled, onClick: reset }));
    const preventDefault = (event) => event.preventDefault();
    const hasError = node.errors.length > 0;
    const errors = (_a = node.errors) === null || _a === void 0 ? void 0 : _a.map((e) => e.message).join(';');
    return (_jsxs("div", { className: `ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`, "data-type": "string", "data-id": node.pointer, children: [_jsxs(Form.Field, { id: node.id, error: hasError, required: options.required === true, onDragOver: preventDefault, onDragEnter: preventDefault, onDrop: drop, readOnly: options.readOnly === true, children: [_jsx("label", { htmlFor: node.id, children: options.title }), status === 'empty' && (_jsxs(Message, { attached: true, style: { cursor: 'pointer' }, error: hasError, children: [_jsxs(Message.Content, { children: [_jsxs(Button, { icon: true, labelPosition: "left", size: "large", children: [_jsx(Icon, { name: "folder open" }), "choose a file"] }), ' ', "or drop a file here"] }), _jsx(Input, { style: {
                                    position: 'absolute',
                                    opacity: 0,
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0
                                }, accept: options.accept, type: "file", error: hasError, id: node.id, disabled: disabled || options.readOnly, onChange: change, children: _jsx("input", { style: { cursor: 'pointer' } }) })] })), status === 'filename' && (_jsxs(Message, { attached: true, icon: !imageUrlTemplate, error: hasError, children: [!imageUrlTemplate && _jsx(Icon, { name: getFileIcon({ type: options.accept || '' }) }), _jsx(Message.Content, { children: _jsx(Item.Group, { unstackable: true, style: { margin: 0 }, children: _jsxs(Item, { children: [imageUrlTemplate && (_jsx(Item.Image, { style: { maxHeight: 76, overflow: 'hidden' }, size: "tiny", src: render(imageUrlTemplate, { value }) })), _jsxs(Item.Content, { verticalAlign: "middle", children: [_jsx(Item.Header, { children: value }), downloadUrlTemplate && (_jsxs("div", { style: {
                                                            position: 'absolute',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            right: 16,
                                                            zIndex: 19
                                                        }, children: [_jsx(Button, { as: "a", icon: "download", target: "_blank", download: true, href: render(downloadUrlTemplate, { value }) }), _jsx(Button, { icon: "trash", onClick: reset, disabled: options.readOnly || disabled })] })), resetButton] })] }) }) })] })), isFile(value) && (_jsxs(Message, { attached: true, icon: status === 'file', error: hasError, children: [status === 'file' && isFile(value) && _jsx(Icon, { name: getFileIcon(value) }), _jsx(Message.Content, { children: _jsx(Item.Group, { unstackable: true, style: { margin: 0 }, children: _jsxs(Item, { children: [status === 'imageData' && (_jsx(Item.Image, { style: { maxHeight: 76, overflow: 'hidden' }, size: "tiny", src: imageData })), _jsxs(Item.Content, { verticalAlign: "middle", children: [_jsx(Item.Header, { children: value.name }), _jsx(Item.Meta, { children: new Date(value.lastModified).toString().replace(/ GMT.*/, '') }), _jsx(Item.Extra, { children: _jsx(Label, { color: "yellow", size: "tiny", children: "added" }) }), resetButton] })] }) }) })] })), hasError && (_jsx(Label, { color: "red", basic: true, prompt: true, pointing: "above", children: errors }))] }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const FileWidgetPlugin = {
    id: 'file-widget',
    use: (node) => node.schema.format === 'file' && deepEqual(node.schema.type, ['string', 'object']),
    Widget: FileWidget
};
//# sourceMappingURL=FileWidget.js.map