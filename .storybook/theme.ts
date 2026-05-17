import { create } from 'storybook/theming';

const ColorNavy = '#3c486b';
const ColorRed = '#c12100';
const ColorOrange = '#f45050';
const ColorYellow = '#f9d949';
const ColorGreen = '#2baf8f';
const ColorBgLighter = '#fbfdff';
const ColorBg = '#f4f6ff';
const ColorBgDarker = '#f4f6ff';
const ColorDarkBg = '#021526';

// const StorybookBgLight = '#edeff8';
const StorybookBgLight = ColorBgDarker;

interface ThemeVarsColors {
    colorPrimary: string;
    colorSecondary: string;
    appBg: string;
    appContentBg: string;
    appHoverBg: string;
    appPreviewBg: string;
    appBorderColor: string;
    appBorderRadius: number;
    fontBase: string;
    fontCode: string;
    textColor: string;
    textInverseColor: string;
    textMutedColor: string;
    barTextColor: string;
    barHoverColor: string;
    barSelectedColor: string;
    barBg: string;
    buttonBg: string;
    buttonBorder: string;
    booleanBg: string;
    booleanSelectedBg: string;
    inputBg: string;
    inputBorder: string;
    inputTextColor: string;
    inputBorderRadius: number;
    brandTitle?: string;
    brandUrl?: string;
    brandImage?: string;
    brandTarget?: string;
    gridCellSize?: number;
}

export const light = create({
    base: 'light',
    brandTitle: '@sagold/json-editor',
    brandUrl: 'https://github.com/sagold/json-editor',
    brandTarget: '_self',
    appBorderRadius: 0,
    // inputBorderRadius: 0
    // fontBase: 'Jost',
    colorPrimary: '#00ff00',
    colorSecondary: ColorGreen, // navigation highlight

    // UI
    appBg: StorybookBgLight,
    appContentBg: StorybookBgLight,
    appPreviewBg: StorybookBgLight,
    barBg: StorybookBgLight
    // appBorderColor: '#eb5b00',

    // Text colors
    // textColor: '#fff',
    // textInverseColor: '#fff'

    // Toolbar default and active colors
    // barTextColor: '#fff',
    // barSelectedColor: '#fff',
    // barHoverColor: '#fff',
    // barBg: '#3c486b'

    // Form colors
    // inputBg: '#ff0000',
    // inputBorder: '#ff0000',
    // inputTextColor: '#ff0000',
});

export const dark = create({
    base: 'dark',
    brandTitle: '@sagold/json-editor',
    brandUrl: 'https://github.com/sagold/json-editor',
    brandTarget: '_self',
    appBorderRadius: 0,
    colorPrimary: ColorOrange, // highlight
    colorSecondary: ColorYellow,

    // UI
    appBg: ColorDarkBg,
    appContentBg: ColorDarkBg, // input form background
    appPreviewBg: ColorDarkBg,
    barBg: ColorDarkBg,
    inputBg: ColorDarkBg
});
