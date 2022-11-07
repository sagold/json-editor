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
            title: 'mandatory filters',
            type: 'array',
            options: {
                collapsed: false,
                editJson: {
                    enabled: true,
                    liveUpdate: true
                }
            },
            items: {
                type: 'object',
                required: ['key', 'op', 'value'],
                options: {
                    layout: {
                        cells: [
                            { prop: 'key', width: 5 },
                            { prop: 'op', width: 2 },
                            { prop: 'value', width: 9 }
                        ]
                    }
                },
                properties: {
                    key: {
                        title: 'key',
                        minLength: 1,
                        type: 'string',
                        description: 'column key to filter'
                    },
                    op: {
                        type: 'string',
                        enum: ['in', 'eq']
                    },
                    value: {
                        title: 'value to permit',
                        type: 'array',
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
                options: {
                    layout: {
                        cells: [
                            { prop: 'internal', width: 16 },
                            { prop: 'mail', width: 6 },
                            { prop: 'firstName', width: 5 },
                            { prop: 'lastName', width: 5 }
                        ]
                    }
                },
                properties: {
                    mail: { title: 'Email', type: 'string', format: 'email' },
                    firstName: { title: 'surname', type: 'string' },
                    lastName: { title: 'lastname', type: 'string' },
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
                options: {
                    layout: {
                        cells: [
                            { prop: 'name', width: 8 },
                            { prop: 'display_name', width: 8 },
                            { prop: 'group_type', width: 4 },
                            { prop: 'description', width: 12 }
                        ]
                    }
                },
                properties: {
                    id: { type: 'string', options: { hidden: true } },
                    deleted: { type: 'boolean', options: { hidden: true } },
                    name: { title: 'name', type: 'string' },
                    display_name: { title: 'display', type: 'string' },
                    description: { title: 'description', type: 'string' },
                    group_type: { title: 'group type', type: 'string' }
                    // group_type: {
                    //     display_name: 'Action Group' | 'Access Group' | 'Notification group' | 'Document group';
                    //     id: 1 | 2 | 3 | 4;
                    //     name: 'action' | 'access';
                    // };
                }
            }
        }
    }
};
