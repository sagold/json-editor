import { Plugin, PluginInstance } from '../HeadlessJsonEditor';

export const EventLoggerPlugin: Plugin = (): PluginInstance => {
    return {
        id: 'eventLogger',
        onEvent(root, event) {
            console.log(event);
        }
    };
};
