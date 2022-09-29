export const data = {
    userview: [
        {
            key: 'my_column',
            op: 'in',
            value: ['eins', '2']
        }
    ],
    users: [
        {
            mail: 'admin@company.com',
            firstName: '',
            lastName: 'admin',
            groups: ['everyone']
        }
    ],
    permissionGroups: [
        {
            name: 'system',
            display_name: 'system',
            description: 'permission to everything - should be used for applications only',
            group_type: 'Access Group'
        },
        {
            name: 'everyone',
            display_name: 'everyone',
            description: 'permission group everyone should have',
            group_type: 'Access Group'
        },
        {
            name: 'it_administrator',
            display_name: 'it_administrator',
            description: 'permission group for portal admins',
            group_type: 'Access Group'
        }
    ]
};

export const schema = {
    title: 'user permissions',
    type: 'object',
    properties: {
        userview: {
            type: 'array',
            items: {
                type: 'object',
                required: ['key', 'op', 'value'],
                properties: {
                    key: {
                        title: 'key',
                        minLength: 1,
                        type: 'string'
                    },
                    op: {
                        type: 'string',
                        enum: ['in', 'eq']
                    },
                    value: {
                        type: 'array',
                        // format: 'tags',
                        items: { type: 'string' }
                    }
                }
            }
        },
        users: {
            title: 'Users',
            type: 'array',
            items: {
                type: 'object',
                required: [],
                properties: {
                    mail: { type: 'string', format: 'email' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    internal: {
                        title: 'internal',
                        description: 'check, if user is an employee',
                        type: 'boolean'
                    },
                    groups: {
                        title: 'Permission Groups',
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['everyone', 'system', 'it_administrator']
                        },
                        uniqueItems: true
                    }
                }
            }
        },
        permissionGroups: {
            title: 'Permission groups',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', options: { hidden: true } },
                    deleted: { type: 'boolean', options: { hidden: true } },
                    name: { type: 'string' },
                    display_name: { type: 'string' },
                    description: { type: 'string' },
                    // group_type: {
                    //     display_name: 'Action Group' | 'Access Group' | 'Notification group' | 'Document group';
                    //     id: 1 | 2 | 3 | 4;
                    //     name: 'action' | 'access';
                    // };
                    group_type: { type: 'string' }
                }
            }
        }
    }
};
