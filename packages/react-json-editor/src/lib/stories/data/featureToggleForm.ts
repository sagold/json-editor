export const schema = {
    type: 'object',
    required: ['trigger'],
    properties: {
        trigger: {
            title: 'show optional schema',
            type: 'boolean',
            default: false
        },
        optional: {
            options: { hidden: true, title: false },
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                }
            }
        },

        check: {
            type: 'null',
            title: 'test attribute - should come last in any case',
            description: 'mimimi'
        }
    },
    allOf: [
        {
            if: {
                required: ['trigger'],
                properties: {
                    trigger: {
                        const: true
                    }
                }
            },
            then: {
                required: ['optional'],
                properties: {
                    optional: {
                        title: 'Optional form',
                        options: { hidden: false },
                        required: ['title']
                    }
                }
            }
        }
    ]
};
