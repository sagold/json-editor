/* eslint-disable */
export default {
    displayName: 'react-json-editor',
    preset: '../../jest.preset.js',
    transform: {
        '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../coverage/packages/react-json-editor'
};
