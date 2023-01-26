import { Form, Button, Message, Input, Icon, Label, Item, SemanticICONS } from 'semantic-ui-react';
import { widget, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { render } from '../../render';
import { deepEqual } from 'fast-equals';
import { useState } from 'react';

const isFile = (v): v is File => Object.prototype.toString.call(v) === '[object File]';

export type FileWidgetOptions = {
    /**
     * mime types to accept for this file selection
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
     */
    accept?: string;
    /**
     * if set will add a download option for this file. The given url needs to
     * contain a {{value}} placeholder which will be replaced by the actual input value
     */
    downloadUrlTemplate?: string;
    /**
     * if set will add an image preview for this file. The given url needs to
     * contain a {{value}} placeholder which will be replaced by the actual input value
     */
    imageUrlTemplate?: string;
} & DefaultNodeOptions;

const MIME_TO_ICON: Record<string, SemanticICONS> = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file excel', // .xlsx
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file word', // .docx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'file powerpoint', // .pptx
    'text/csv': 'file excel', // .csv
    'text/plain': 'file text', // .txt
    'text/html': 'file code', // .html
    'application/zip': 'file archive', // .zip
    'application/pdf': 'file pdf', // .pdf
    'application/json': 'file code', // .json
    'video/mp4': 'file video', // .mp4
    'image/png': 'file image', // .png
    'image/jpeg': 'file image', // .jpg
    'image/gif': 'file image' // .gif
};

function getFileIcon(file: File) {
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

function isImageFile(file: File) {
    return file.type.startsWith('image');
}

async function getDataUrl(file: File): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt) => resolve(evt?.target?.result as string);
        reader.onerror = reject;
    });
}

/**
 * @todo note that files cannot be on root because the tree will be recreated
 * and then an object is created. this has to be support thouroughly. Until then,
 * single files using strings do work.
 */
export const FileWidget = widget<StringNode<FileWidgetOptions>, string | File>(({ node, options, setValue }) => {
    const { value } = node;
    const { disabled, imageUrlTemplate, downloadUrlTemplate } = options;
    const [imageData, setImageData] = useState<string | undefined>();

    let status: 'empty' | 'file' | 'filename' | 'imageUrl' | 'imageData' = 'empty';
    if (isFile(value) && imageData) {
        status = 'imageData';
    } else if (isFile(value)) {
        status = 'file';
    } else if (typeof value === 'string' && value?.length > 0) {
        status = 'filename';
    }

    async function setFile(file: File) {
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

    const resetButton = (
        <Button
            icon="trash"
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 16,
                zIndex: 19
            }}
            disabled={options.readOnly || disabled}
            onClick={reset}
        />
    );

    const preventDefault = (event) => event.preventDefault();
    const hasError = node.errors.length > 0;
    const errors = node.errors?.map((e) => e.message).join(';');

    return (
        <div
            className={`ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`}
            data-type="string"
            data-id={node.pointer}
        >
            <Form.Field
                id={node.id}
                error={hasError}
                required={options.required === true}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                onDrop={drop}
                readOnly={options.readOnly === true}
            >
                <label htmlFor={node.id}>{options.title}</label>

                {status === 'empty' && (
                    <Message attached style={{ cursor: 'pointer' }} error={hasError}>
                        <Message.Content>
                            <Button icon labelPosition="left" size="large">
                                <Icon name="folder open" />
                                choose a file
                            </Button>
                        </Message.Content>
                        <Input
                            style={{
                                position: 'absolute',
                                opacity: 0,
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            }}
                            accept={options.accept}
                            type="file"
                            error={hasError}
                            id={node.id}
                            disabled={disabled || options.readOnly}
                            onChange={change}
                        >
                            <input style={{ cursor: 'pointer' }} />
                        </Input>
                    </Message>
                )}

                {status === 'filename' && (
                    <Message attached icon={!imageUrlTemplate} error={hasError}>
                        {!imageUrlTemplate && <Icon name={getFileIcon({ type: options.accept || '' } as File)} />}
                        <Message.Content>
                            <Item.Group unstackable style={{ margin: 0 }}>
                                <Item>
                                    {imageUrlTemplate && (
                                        <Item.Image
                                            style={{ maxHeight: 76, overflow: 'hidden' }}
                                            size="tiny"
                                            src={render(imageUrlTemplate, { value })}
                                        />
                                    )}
                                    <Item.Content verticalAlign="middle">
                                        <Item.Header>{value}</Item.Header>
                                        {downloadUrlTemplate && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    right: 16,
                                                    zIndex: 19
                                                }}
                                            >
                                                <Button
                                                    as="a"
                                                    icon="download"
                                                    target="_blank"
                                                    download
                                                    href={render(downloadUrlTemplate, { value })}
                                                />
                                                <Button
                                                    icon="trash"
                                                    onClick={reset}
                                                    disabled={options.readOnly || disabled}
                                                />
                                            </div>
                                        )}
                                        {resetButton}
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Message.Content>
                    </Message>
                )}

                {isFile(value) && (
                    <Message attached icon={status === 'file'} error={hasError}>
                        {status === 'file' && isFile(value) && <Icon name={getFileIcon(value)} />}
                        <Message.Content>
                            <Item.Group unstackable style={{ margin: 0 }}>
                                <Item>
                                    {status === 'imageData' && (
                                        <Item.Image
                                            style={{ maxHeight: 76, overflow: 'hidden' }}
                                            size="tiny"
                                            src={imageData}
                                        />
                                    )}
                                    <Item.Content verticalAlign="middle">
                                        <Item.Header>{value.name}</Item.Header>
                                        <Item.Meta>
                                            {new Date(value.lastModified).toString().replace(/ GMT.*/, '')}
                                        </Item.Meta>
                                        <Item.Extra>
                                            <Label color="yellow" size="tiny">
                                                added
                                            </Label>
                                        </Item.Extra>
                                        {resetButton}
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Message.Content>
                    </Message>
                )}
                {hasError && (
                    <Label color="red" basic prompt pointing="above">
                        {errors}
                    </Label>
                )}
            </Form.Field>
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export const FileWidgetPlugin: WidgetPlugin = {
    id: 'file-widget',
    use: (node) => node.schema.format === 'file' && deepEqual(node.schema.type, ['string', 'object']),
    Widget: FileWidget
};
