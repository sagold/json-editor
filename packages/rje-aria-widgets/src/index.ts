// shortcut with widgets assigned
import { JsonForm } from './lib/components/JsonForm';
// main export
import { widgets } from './lib/widgets/index';
// widgets
import { ArrayWidget, ArrayWidgetPlugin, type ArrayOptions } from './lib/widgets/arraywidget/ArrayWidget';
import {
    BooleanWidget,
    BooleanWidgetPlugin,
    type BooleanOptions,
    booleanDefaultOptions
} from './lib/widgets/booleanwidget/BooleanWidget';
import { ColorWidget, ColorWidgetPlugin, type ColorOptions } from './lib/widgets/colorwidget/ColorWidget';
import { DateWidget, DateWidgetPlugin, type DateOptions } from './lib/widgets/datewidget/DateWidget';
import { FileWidget, FileWidgetPlugin, type FileOptions } from './lib/widgets/filewidget/FileWidget';
import { NavigationWidget, type NavigationOptions } from './lib/widgets/navigationwidget/NavigationWidget';
import { NullWidget, NullWidgetPlugin, type NullOptions } from './lib/widgets/nullwidget/NullWidget';
import { NumberWidget, NumberWidgetPlugin, type NumberOptions } from './lib/widgets/numberwidget/NumberWidget';
import { ObjectWidget, ObjectWidgetPlugin, type ObjectOptions } from './lib/widgets/objectwidget/ObjectWidget';
import { SelectOneOfWidget, SelectOneOfWidgetPlugin } from './lib/widgets/selectoneofwidget/SelectOneOfWidget';
import {
    SelectMultipleWidget,
    SelectMultipleWidgetPlugin,
    type SelectMultipleOptions
} from './lib/widgets/selectmultiplewidget/SelectMultipleWidget';
import { StringWidget, StringWidgetPlugin, type StringOptions } from './lib/widgets/stringwidget/StringWidget';
import { SelectWidget, SelectWidgetPlugin, type SelectOptions } from './lib/widgets/selectwidget/SelectWidget';
import {
    SimpleJsonWidget,
    SimpleJsonWidgetPlugin,
    type SimpleJsonOptions
} from './lib/widgets/simplejsonwidget/SimpleJsonWidget';
import { UnknownWidget, type UnknownWidgetPlugin } from './lib/widgets/unknownwidget/UnknownWidget';
import { TextWidget, TextWidgetPlugin, type TextOptions } from './lib/widgets/textwidget/TextWidget';
import { TagListWidget, TagListWidgetPlugin, type TagListOptions } from './lib/widgets/taglistwidget/TagListWidget';
// components
import { Button, ButtonProps, ButtonControlled, type ButtonControlledProps } from './lib/components/button/Button';
import { Checkbox, type CheckboxProps } from './lib/components/checkbox/Checkbox';
import { ColorInput, type ColorInputProps } from './lib/components/colorinput/ColorInput';
import { DateInput, type DateInputProps } from './lib/components/dateinput/DateInput';
import { DatePicker, type DatePickerProps } from './lib/components/datepicker/DatePicker';
import { TagList, type TagListProps } from './lib/components/taglist/TagList';
import { TagListInput, type TagListInputProps } from './lib/components/taglistinput/TagListInput';
import { FileField, type FileFieldProps } from './lib/components/filefield/FileField';
import { Icon, type IconProps } from './lib/components/icon/Icon';
import { StringInput, type StringInputProps } from './lib/components/input/StringInput';
import { TimeInput, type TimeInputProps } from './lib/components/timeinput/TimeInput';
import { NumberInput, type NumberInputProps } from './lib/components/input/NumberInput';
import { Label, type LabelProps } from './lib/components/label/Label';
import { useModal, type UseModalProps, Modal, type ModalProps } from './lib/components/modal/Modal';
import { usePopover, type UsePopoverProps, Popover, type PopoverProps } from './lib/components/popover/Popover';
import {
    SectionHeader,
    SectionHeaderLabel,
    type SectionHeaderLabelProps
} from './lib/components/sectionheader/SectionHeader';
import { Select, type SelectProps } from './lib/components/select/Select';
import {
    type SingleSelectOptions,
    type MultiSelectOptions,
    type SelectOptionProps,
    SelectOptionsControlled,
    type SelectOptionsControlledProps
} from './lib/components/selectoptions/SelectOptions';
import { Switch, type SwitchProps } from './lib/components/switch/Switch';
import { TextArea, type TextAreaProps } from './lib/components/textarea/TextArea';
import { Theme, type ThemeProps } from './lib/components/theme/Theme';
import { useTooltip, type UseTooltipProps, Tooltip, type TooltipProps } from './lib/components/tooltip/Tooltip';
import { WidgetDescription, type WidgetDescriptionProps } from './lib/components/widgetdescription/WidgetDescription';
import { WidgetError, type WidgetErrorProps } from './lib/components/widgeterror/WidgetError';
import { WidgetField, type WidgetFieldProps, type WidgetFieldHeaderProps } from '@sagold/react-json-editor';

export default widgets;
export {
    // all widgets
    widgets,
    // widgets
    ArrayOptions,
    ArrayWidget,
    ArrayWidgetPlugin,
    BooleanOptions,
    booleanDefaultOptions,
    BooleanWidget,
    BooleanWidgetPlugin,
    ColorOptions,
    ColorWidget,
    ColorWidgetPlugin,
    DateOptions,
    DateWidget,
    DateWidgetPlugin,
    FileOptions,
    FileWidget,
    FileWidgetPlugin,
    NavigationWidget,
    NullWidget,
    NullWidgetPlugin,
    NumberWidget,
    NumberWidgetPlugin,
    ObjectWidget,
    ObjectWidgetPlugin,
    SelectMultipleWidget,
    SelectMultipleWidgetPlugin,
    SelectOneOfWidget,
    SelectOneOfWidgetPlugin,
    SelectWidget,
    SelectWidgetPlugin,
    SimpleJsonWidget,
    SimpleJsonWidgetPlugin,
    StringWidget,
    StringWidgetPlugin,
    TagListWidget,
    TagListWidgetPlugin,
    TextWidget,
    TextWidgetPlugin,
    UnknownWidget,
    UnknownWidgetPlugin,
    // components
    Button,
    ButtonControlled,
    Checkbox,
    ColorInput,
    DateInput,
    DatePicker,
    FileField,
    Icon,
    JsonForm,
    Label,
    Modal,
    MultiSelectOptions,
    NumberInput,
    Popover,
    SectionHeader,
    SectionHeaderLabel,
    Select,
    SelectOptionsControlled,
    SingleSelectOptions,
    StringInput,
    Switch,
    TagList,
    TagListInput,
    TextArea,
    TimeInput,
    Theme,
    Tooltip,
    useModal,
    usePopover,
    useTooltip,
    WidgetDescription,
    WidgetError,
    WidgetField
};

export type {
    ButtonControlledProps,
    ButtonProps,
    CheckboxProps,
    ColorInputProps,
    DateInputProps,
    DatePickerProps,
    FileFieldProps,
    IconProps,
    LabelProps,
    ModalProps,
    NavigationOptions,
    NullOptions,
    NumberInputProps,
    NumberOptions,
    ObjectOptions,
    PopoverProps,
    SectionHeaderLabelProps,
    SelectMultipleOptions,
    SelectOptionProps,
    SelectOptions,
    SelectOptionsControlledProps,
    SelectProps,
    SimpleJsonOptions,
    StringInputProps,
    StringOptions,
    SwitchProps,
    TagListInputProps,
    TagListOptions,
    TagListProps,
    TextAreaProps,
    TextOptions,
    ThemeProps,
    TimeInputProps,
    TooltipProps,
    UseModalProps,
    UsePopoverProps,
    UseTooltipProps,
    WidgetDescriptionProps,
    WidgetErrorProps,
    WidgetFieldHeaderProps,
    WidgetFieldProps
};
