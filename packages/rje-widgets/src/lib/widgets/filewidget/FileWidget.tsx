import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, deepEqual } from '@sagold/react-json-editor';
import { render } from '../../render';
import { useState } from 'react';
import { Button } from '../../components/button/Button';
import { Label } from '../../components/label/Label';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { FileField } from '../../components/filefield/FileField';
import { Icon } from '../../components/icon/Icon';
import { StringInput } from '../../components/input/StringInput';

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

const MIME_TO_ICON: Record<string, string> = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'insert_drive_file', // .xlsx
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'article', // .docx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'insert_drive_file', // .pptx
    'text/csv': 'article', // .csv
    'text/plain': 'insert_drive_file', // .txt
    'text/html': 'article', // .html
    'application/zip': 'insert_drive_file', // .zip
    'application/pdf': 'insert_drive_file', // .pdf
    'application/json': 'article', // .json
    'video/mp4': 'video_file', // .mp4
    'image/png': 'photo', // .png
    'image/jpeg': 'photo', // .jpg
    'image/gif': 'photo', // .gif
    default: 'insert_drive_file'
};

function getFileIcon(file: File) {
    if (MIME_TO_ICON[file.type]) {
        return MIME_TO_ICON[file.type];
    }
    if (file.type.startsWith('image')) {
        return 'photo';
    }
    if (file.type.startsWith('video')) {
        return 'video_file';
    }
    if (file.type.startsWith('text')) {
        return 'article';
    }
    console.log('unknown file type', file.type);
    return 'insert_drive_file';
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

    function change(file: File) {
        setFile(file);
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
            variant="text"
            icon="delete"
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 16,
                zIndex: 19
            }}
            disabled={options.readOnly || disabled}
            onPress={reset}
        />
    );

    const hasError = node.errors.length > 0;
    return (
        <WidgetField widgetType="file" node={node} options={options} style={{ position: 'relative' }}>
            {status === 'empty' && (
                <FileField
                    label={options.title}
                    buttonText={'choose a file'}
                    accept={options.accept}
                    error={hasError}
                    id={node.id}
                    disabled={disabled || options.readOnly}
                    onPress={change}
                />
            )}

            {status === 'filename' && (
                <div className="rje-preview" style={{ display: 'flex', gap: 8 }}>
                    <div>
                        {!imageUrlTemplate && <Icon>{getFileIcon({ type: options.accept || '' } as File)}</Icon>}
                        {imageUrlTemplate && (
                            <img
                                style={{ maxHeight: 76, overflow: 'hidden' }}
                                src={render(imageUrlTemplate, { value })}
                            />
                        )}
                    </div>
                    <div>
                        <Label required={options.required}>{options.title}</Label>
                        <StringInput readOnly={true} value={value} />
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
                                <a
                                    // icon="download"
                                    target="_blank"
                                    download
                                    href={render(downloadUrlTemplate, { value })}
                                />
                                <Button
                                    variant="text"
                                    icon="delete"
                                    onPress={reset}
                                    disabled={options.readOnly || disabled}
                                />
                            </div>
                        )}
                    </div>
                    {resetButton}
                </div>
            )}

            {isFile(value) && (
                <>
                    <Label required={options.required}>{options.title}</Label>
                    {status === 'file' && isFile(value) && <Icon>{getFileIcon(value)}</Icon>}
                    {status === 'imageData' && (
                        <>
                            <img style={{ maxHeight: 76, overflow: 'hidden' }} src={imageData} />
                            <StringInput readOnly={true} value={value.name} />
                            {new Date(value.lastModified).toString().replace(/ GMT.*/, '')}
                            <Label color="yellow">added</Label>
                        </>
                    )}
                    {resetButton}
                </>
            )}
        </WidgetField>
    );
});

export const FileWidgetPlugin: WidgetPlugin = {
    id: 'file-widget',
    use: (node) => node.schema.format === 'file' && deepEqual(node.schema.type, ['string', 'object']),
    Widget: FileWidget
};
