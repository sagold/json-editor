import { StringNode, DefaultNodeOptions } from 'headless-json-editor';
import { Form, Button, Message, Input, Icon, Label, Item, SemanticICONS } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '../decorators';
import { deepEqual } from 'fast-equals';
import { useState } from 'react';

const isFile = (v): v is File => Object.prototype.toString.call(v) === '[object File]';

export type FileOptions = {
    /**
     * mime types to accept for this file selection
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
     */
    accept?: string;
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
export const FileWidget = widget<StringNode<FileOptions>, string | File>(({ node, options, setValue }) => {
    const { value } = node;
    const { disabled } = options;
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

    // @ts-ignore
    // node.errors.push({ message: 'huhu' });

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
            onClick={reset}
        />
    );

    const preventDefault = (event) => event.preventDefault();

    return (
        <div
            className={`ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`}
            data-type="string"
            data-id={node.pointer}
        >
            <Form.Field
                id={node.id}
                error={node.errors?.length === 0 ? false : { content: node.errors?.map((e) => e.message).join(';') }}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                onDrop={drop}
            >
                <label htmlFor={node.id}>{options.title}</label>

                {status === 'empty' && (
                    <Message style={{ cursor: 'pointer' }}>
                        <Message.Content>
                            <Button icon labelPosition="left" size="large">
                                <Icon name="folder open" />
                                choose a file
                            </Button>{' '}
                            or drop a file here
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
                            error={false}
                            id={node.id}
                            disabled={disabled}
                            onChange={change}
                        >
                            <input style={{ cursor: 'pointer' }} />
                        </Input>
                    </Message>
                )}

                {status === 'filename' && (
                    <Message icon>
                        <Icon name="file" />
                        <Message.Content>
                            <Message.Header>{node.value}</Message.Header>
                            {resetButton}
                        </Message.Content>
                    </Message>
                )}

                {isFile(value) && (
                    <Message icon={status === 'file'}>
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
