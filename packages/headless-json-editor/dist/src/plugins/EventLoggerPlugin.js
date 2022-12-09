export const EventLoggerPlugin = () => {
    return {
        id: 'eventLogger',
        onEvent(root, event) {
            console.log(event);
        }
    };
};
//# sourceMappingURL=EventLoggerPlugin.js.map