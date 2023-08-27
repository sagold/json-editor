// shortcut with widgets assigned
import { JsonForm } from './lib/components/JsonForm';
// main export
import { widgets } from './lib/widgets/index';
// widgets
import { ArrayWidget, ArrayWidgetPlugin } from './lib/widgets/arraywidget/ArrayWidget';
import { BooleanWidget, BooleanWidgetPlugin, booleanDefaultOptions } from './lib/widgets/booleanwidget/BooleanWidget';
import { ColorWidget, ColorWidgetPlugin } from './lib/widgets/colorwidget/ColorWidget';
import { DateWidget, DateWidgetPlugin } from './lib/widgets/datewidget/DateWidget';
import { FileWidget, FileWidgetPlugin } from './lib/widgets/filewidget/FileWidget';
import { NavigationWidget } from './lib/widgets/navigationwidget/NavigationWidget';
import { NullWidget, NullWidgetPlugin } from './lib/widgets/nullwidget/NullWidget';
import { NumberWidget, NumberWidgetPlugin } from './lib/widgets/numberwidget/NumberWidget';
import { ObjectWidget, ObjectWidgetPlugin } from './lib/widgets/objectwidget/ObjectWidget';
import { SelectOneOfWidget, SelectOneOfWidgetPlugin } from './lib/widgets/selectoneofwidget/SelectOneOfWidget';
import {
    SelectMultipleWidget,
    SelectMultipleWidgetPlugin
} from './lib/widgets/selectmultiplewidget/SelectMultipleWidget';
import { StringWidget, StringWidgetPlugin } from './lib/widgets/stringwidget/StringWidget';
import { SelectWidget, SelectWidgetPlugin } from './lib/widgets/selectwidget/SelectWidget';
import { SimpleJsonWidget, SimpleJsonWidgetPlugin } from './lib/widgets/simplejsonwidget/SimpleJsonWidget';
import { UnknownWidget, UnknownWidgetPlugin } from './lib/widgets/unknownwidget/UnknownWidget';
import { TextWidget, TextWidgetPlugin } from './lib/widgets/textwidget/TextWidget';
import { TagListWidget, TagListWidgetPlugin } from './lib/widgets/taglistwidget/TagListWidget';
// components
import { Button, ButtonProps, ButtonControlled, ButtonControlledProps } from './lib/components/button/Button';
import { Checkbox, CheckboxProps } from './lib/components/checkbox/Checkbox';
import { ColorInput, ColorInputProps } from './lib/components/colorinput/ColorInput';
import { DateInput, type DateInputProps } from './lib/components/dateinput/DateInput';
import { DatePicker, type DatePickerProps } from './lib/components/datepicker/DatePicker';
import { TagList, type TagListProps } from './lib/components/taglist/TagList';
import { TagListInput, type TagListInputProps } from './lib/components/taglistinput/TagListInput';
import { FileField, FileFieldProps } from './lib/components/filefield/FileField';
import { Icon, IconProps } from './lib/components/icon/Icon';
import { StringInput, StringInputProps } from './lib/components/input/StringInput';
import { TimeInput, TimeInputProps } from './lib/components/timeinput/TimeInput';
import { NumberInput, NumberInputProps } from './lib/components/input/NumberInput';
import { Label, LabelProps } from './lib/components/label/Label';
import { useModal, UseModalProps, Modal, ModalProps } from './lib/components/modal/Modal';
import { usePopover, UsePopoverProps, Popover, PopoverProps } from './lib/components/popover/Popover';
import {
    SectionHeader,
    SectionHeaderLabel,
    SectionHeaderLabelProps
} from './lib/components/sectionheader/SectionHeader';
import { Select, SelectProps } from './lib/components/select/Select';
import {
    SingleSelectOptions,
    MultiSelectOptions,
    SelectOptionProps,
    SelectOptionsControlled,
    SelectOptionsControlledProps
} from './lib/components/selectoptions/SelectOptions';
import { Switch, SwitchProps } from './lib/components/switch/Switch';
import { TextArea, TextAreaProps } from './lib/components/textarea/TextArea';
import { Theme, ThemeProps } from './lib/components/theme/Theme';
import { useTooltip, UseTooltipProps, Tooltip, TooltipProps } from './lib/components/tooltip/Tooltip';
import { WidgetDescription, WidgetDescriptionProps } from './lib/components/widgetdescription/WidgetDescription';
import { WidgetError, WidgetErrorProps } from './lib/components/widgeterror/WidgetError';
import { WidgetField, WidgetFieldProps, WidgetFieldHeaderProps } from '@sagold/react-json-editor';

export default widgets;
export {
    // all widgets
    widgets,
    // widgets
    ArrayWidget,
    ArrayWidgetPlugin,
    booleanDefaultOptions,
    BooleanWidget,
    BooleanWidgetPlugin,
    ColorWidget,
    ColorWidgetPlugin,
    DateWidget,
    DateWidgetPlugin,
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
    NumberInputProps,
    PopoverProps,
    SectionHeaderLabelProps,
    SelectOptionProps,
    SelectOptionsControlledProps,
    SelectProps,
    StringInputProps,
    SwitchProps,
    TagListProps,
    TagListInputProps,
    TextAreaProps,
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
