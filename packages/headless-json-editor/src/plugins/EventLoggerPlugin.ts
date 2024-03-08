import { Plugin, PluginInstance } from './Plugin';

export const EventLoggerPlugin: Plugin = (): PluginInstance => {
    return {
        id: 'eventLogger',
        onEvent(root, event) {
            console.log(event);
        }
    };
};
