import '@mantine/dates/styles.css';
import { DateInput, DateValue, TimeInput } from '@mantine/dates';
import {
    widget,
    WidgetPlugin,
    StringNode,
    DefaultNodeOptions,
    WidgetField,
    WidgetProps,
    DecoratedWidgetProps
} from '@sagold/react-json-editor';
import { widgetInputProps } from '../../components/widgetInputProps';
import { WidgetMenuItems } from '../../components/widgetmenu/WidgetMenu';
import { getSections } from '../getSections';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useEffect, useMemo, useState } from 'react';

export type DateOptions = DefaultNodeOptions<{
    /** date and time display format for input field @see https://day.js.org/docs/en/parse/string-format */
    format?: string;
    /** for time inputs, show seconds */
    seconds?: boolean;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;

    swapIconPosition?: boolean;
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
}>;

export const DateWidget = function (props: WidgetProps) {
    const format = props.node.schema.format;
    if (format === 'time') {
        return <TimeWidget {...(props as DecoratedWidgetProps<StringNode, string>)} />;
    }
    return <DateTimeWidget {...(props as DecoratedWidgetProps<StringNode, string>)} />;
};

function toLocalTime(time?: string) {
    if (time == null || time === '') {
        return '';
    }
    try {
        const date = new Date(`2000-10-20T${time}`);
        return dayjs(date).format('HH:mm:ss');
    } catch (e) {
        console.log('failed parsing date', e);
    }
    return '';
}

function isInvalidDate(date) {
    return isNaN(date.getTime());
}

function toZuluTime(time: string) {
    try {
        const date = new Date(`2000-10-20T${time}`);
        if (isInvalidDate(date)) {
            return time;
        }
        return dayjs(date).utc().format('HH:mm:ss[Z]');
    } catch (e) {
        return time;
    }
}

const TimeWidget = widget<StringNode<DateOptions>, string>(({ node, options, setValue }) => {
    const [leftSection, rightSection] = getSections(options.icon, options.tag, options.swapIconPosition);
    const [internalTime, setInternalTime] = useState<string>(toLocalTime(node.value));
    useEffect(() => {
        setInternalTime(toLocalTime(node.value));
    }, [node.value, setInternalTime]);
    return (
        <WidgetField widgetType="date" node={node} options={options} showDescription={false} showError={false}>
            <TimeInput
                {...widgetInputProps(node, options)}
                leftSection={leftSection}
                rightSection={rightSection}
                value={internalTime ?? ''}
                withSeconds={options.seconds ?? false}
                onChange={(event) => {
                    setInternalTime(event.currentTarget.value);
                }}
                onBlur={() => {
                    console.log('save', toZuluTime(internalTime));
                    setValue(toZuluTime(internalTime));
                }}
            />
        </WidgetField>
    );
});

export const DateTimeWidget = widget<StringNode<DateOptions>, string>(({ node, options, setValue }) => {
    const [leftSection, rightSection] = getSections(options.icon, options.tag, options.swapIconPosition);
    const format = node.schema.format;
    const valueFormat = (options.format ?? format === 'date') ? 'DD MMM YYYY' : 'DD MMM YYYY HH:mm';
    const date = useMemo(() => {
        if (node.value == null || node.value === '') {
            console.log(`empty date ${node.value}`);
            return undefined;
        }
        try {
            return new Date(node.value ?? '');
        } catch (e) {
            console.log(`Invalid date ${node.value}`);
            return undefined;
        }
    }, [node.value]);
    return (
        <WidgetField widgetType="date" node={node} options={options} showDescription={false} showError={false}>
            <DateInput
                {...widgetInputProps(node, options)}
                leftSection={leftSection}
                rightSection={rightSection}
                value={date}
                valueFormat={valueFormat}
                onChange={(date: DateValue) => {
                    if (!date) {
                        return setValue('');
                    }
                    if (format === 'date') {
                        return setValue(dayjs(date).utc().format('YYYY-MM-DD'));
                    }
                    setValue(date.toISOString());
                }}
            />
        </WidgetField>
    );
});

// const isHHmmsss = /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)$/;
export const DateWidgetPlugin: WidgetPlugin = {
    id: 'date-widget',
    use: (node) => {
        if (node.schema.type !== 'string') {
            return false;
        }

        // @ts-expect-error since we are not checking node type here (because we test the value)
        // const value = node.value;
        if (node.schema.format === 'time' /*&& (value === '' || isHHmmsss.test(value))*/) {
            return true;
        }

        return node.schema.format === 'date' || node.schema.format === 'date-time';
    },

    Widget: DateWidget
};
