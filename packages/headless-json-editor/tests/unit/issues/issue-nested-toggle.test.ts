import { Draft07, Draft } from 'json-schema-library';
import { createNode } from '../../../src/node/createNode';
import { getNode } from '../../../src/node/getNode';
import { strict as assert } from 'assert';
import { isJsonError } from '../../../src/types';
import { setValue } from '../../../src/transform/setValue';

describe('issues createNode', () => {
    let draft: Draft;

    beforeEach(() => {
        draft = new Draft07(createSchema());
    });

    it('should create TotalAmount with options readonly=true', () => {
        const root = createNode(draft, {
            useDetails: true,
            ID: 'Fund A',
            Type: 'A',
            details: [
                {
                    sumTotal: true
                }
            ]
        });
        const targetNode = getNode(root, '/details/0/TotalAmount');
        assert(!isJsonError(targetNode));
        assert.equal(targetNode.options.readOnly, true);
    });

    it('should change TotalAmount to options readonly=undefined', () => {
        const root = createNode(draft, {
            useDetails: true,
            ID: 'Fund A',
            Type: 'A',
            details: [
                {
                    sumTotal: true
                }
            ]
        });

        const [nextRoot] = setValue(draft, root, '/details/0/sumTotal', false);

        assert(!isJsonError(nextRoot));
        const targetNode = getNode(nextRoot, '/details/0/TotalAmount');
        assert(!isJsonError(targetNode));
        assert.equal(targetNode.options.readOnly, undefined);
    });

    it('should create TotalAmount as without option readonly', () => {
        const root = createNode(draft, {
            useDetails: true,
            ID: 'Fund A',
            Type: 'A',
            details: [
                {
                    sumTotal: false
                }
            ]
        });
        const targetNode = getNode(root, '/details/0/TotalAmount');
        assert(!isJsonError(targetNode));
        assert.equal(targetNode.options.readOnly, undefined);
    });

    it('should change TotalAmount to options readonly=true', () => {
        const root = createNode(draft, {
            useDetails: true,
            ID: 'Fund A',
            Type: 'A',
            details: [
                {
                    sumTotal: false
                }
            ]
        });

        const [nextRoot] = setValue(draft, root, '/details/0/sumTotal', true);

        assert(!isJsonError(nextRoot));
        const targetNode = getNode(nextRoot, '/details/0/TotalAmount');
        assert(!isJsonError(targetNode));
        assert.equal(targetNode.options.readOnly, true);
    });
});

function createSchema() {
    return {
        type: 'object',
        required: ['ID', 'Type', 'useDetails', 'details'],
        properties: {
            ID: { type: 'string' },
            Type: {
                type: 'string',
                enum: ['A', 'B']
            },
            useDetails: {
                type: 'boolean',
                format: 'toggle',
                default: true
            },
            details: { type: 'array' }
        },
        allOf: [
            {
                if: {
                    properties: { Type: { const: 'A' } }
                },
                then: {
                    properties: {
                        details: {
                            type: 'array',
                            items: {
                                title: 'A',
                                type: 'object',
                                required: ['Share', 'TotalAmount', 'sumTotal', 'Investments', 'Entry_Fees'],
                                additionalProperties: false,
                                properties: {
                                    Share: { type: 'string' },
                                    TotalAmount: { type: 'number' },
                                    sumTotal: {
                                        type: 'boolean',
                                        default: true
                                    },
                                    Investments: { title: 'Investments', type: 'number' },
                                    Entry_Fees: { title: 'Entry Fees', type: 'number' }
                                },
                                if: {
                                    properties: {
                                        sumTotal: {
                                            const: true
                                        }
                                    }
                                },
                                then: {
                                    properties: {
                                        TotalAmount: {
                                            options: { readOnly: true },
                                            summands: ['Investments', 'Entry_Fees']
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]
    };
}
