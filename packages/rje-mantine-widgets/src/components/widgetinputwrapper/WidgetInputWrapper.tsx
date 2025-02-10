import { DividerProps, InputWrapper, TitleProps } from '@mantine/core';
import { WidgetDescription } from '../WidgetDescription';
import { DefaultNodeOptions, JsonError } from '@sagold/react-json-editor';
import { ReactNode } from 'react';
import { isStringWithContent } from '../../helper/isStringWithContent';
import classNames from 'classnames';

export type WidgetInputWrapperProps = {
    header?: ReactNode;
    errors?: JsonError[];
    children?: ReactNode | ReactNode[];
    options: Pick<DefaultNodeOptions, 'required' | 'title' | 'description'> & {
        collapsed?: boolean;
        descriptionInline?: boolean;
        showTitleDivider?: boolean;
        showHeaderMenu?: boolean;
        dividerProps?: Pick<DividerProps, 'labelPosition' | 'color'>;
        titleProps?: TitleProps;
        showHeader?: boolean;
    };
};

export function WidgetInputWrapper({ header, children, errors, options }: WidgetInputWrapperProps) {
    const withInlineDescription = !options.descriptionInline && isStringWithContent(options.description);
    return (
        <InputWrapper
            className={classNames('rje-widget__input-wrapper', header && 'with-title')}
            description={withInlineDescription ? <WidgetDescription text={options.description} /> : undefined}
            label={header}
            error={errors?.map((e) => e.message).join('\n')}
            classNames={{ label: 'rje-widget__label' }}
        >
            {children}
        </InputWrapper>
    );
}
