import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, FileNode, deepEqual } from '@sagold/react-json-editor';
import { render } from '../../render';
import { useEffect, useState } from 'react';
import { Button } from '../../components/button/Button';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { FileField } from '../../components/filefield/FileField';

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
    showPreview?: boolean;
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
export const FileWidget = widget<StringNode<FileWidgetOptions> | FileNode<FileWidgetOptions>, string | File>(({ node, options, setValue }) => {
    const { value } = node;
    const { disabled, imageUrlTemplate, downloadUrlTemplate } = options;
    const [imageData, setImageData] = useState<string | undefined>();

    useEffect(() => {
        if (isFile(value) && isImageFile(value)) {
            getDataUrl(value).then(dataUrl => {
                if (dataUrl) { setImageData(dataUrl); }
            });
        }
    }, [value]);

    let icon = 'folder_open';
    let status: 'empty' | 'file' | 'filename' | 'imageUrl' | 'imageData' = 'empty';
    if (isFile(value) && imageData) {
        status = 'imageData';
        icon = getFileIcon(value);
    } else if (isFile(value)) {
        status = 'file';
        icon = getFileIcon(value);
    } else if (typeof value === 'string' && value?.length > 0) {
        status = 'filename';
        icon = getFileIcon({ type: options.accept || '' } as File);
    }

    async function setFile(file?: File) {
        if (file == null) {
            reset();
            return;
        }

        setValue(file);
        if (isImageFile(file)) {
            const dataUrl = await getDataUrl(file);
            dataUrl && setImageData(dataUrl);
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

    const withPreview = options.showPreview !== false && ((status === 'filename' && imageUrlTemplate) || (isFile(value) && status === 'imageData'));

    // @todo File date and added flag
    // {new Date(value.lastModified).toString().replace(/ GMT.*/, '')}
    // <Label color="yellow">added</Label>

    console.log("file value", isFile(value), status)

    const hasError = node.errors.length > 0;
    return (
        <WidgetField widgetType="file" node={node} options={options} style={{ position: 'relative' }}>
            <FileField
                accept={options.accept}
                buttonText={'choose a file'}
                disabled={disabled || options.readOnly}
                icon={icon}
                error={hasError}
                id={node.id}
                label={options.title}
                onPress={setFile}
                title={options.title}
                value={isFile(value) ? value.name : value}
            >
                {withPreview && (
                    <div className="rje-file__preview">
                        {status === 'filename' && imageUrlTemplate && (
                            <div>
                                <img
                                    style={{ maxHeight: 76, overflow: 'hidden' }}
                                    src={render(imageUrlTemplate, { value })}
                                />
                            </div>
                        )}
                        {isFile(value) && status === 'imageData' && (
                            <>
                                <img style={{ maxHeight: 76, overflow: 'hidden' }} src={imageData} />
                            </>
                        )}
                    </div>
                )}
            </FileField>
            {status === 'filename' && downloadUrlTemplate && (
                <a
                    style={{ textDecoration: 'none' }}
                    // icon="download"
                    target="_blank"
                    download
                    href={render(downloadUrlTemplate, { value })} rel="noreferrer"
                >
                    <Button icon="download" variant="text">
                        download
                    </Button>
                </a>
            )}
        </WidgetField>
    );
});

export const FileWidgetPlugin: WidgetPlugin = {
    id: 'file-widget',
    use: (node) => node.schema.format === 'file' && deepEqual(node.schema.type, ['string', 'object']),
    Widget: FileWidget
};
