import { Plugin } from '../HeadlessEditor';

export const EventLoggerPlugin: Plugin = () => {
    return {
        id: 'eventLogger',
        onEvent(root, event) {
            console.log(event);
        }
    };
};
