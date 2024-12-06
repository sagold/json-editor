import { strict as assert } from 'assert';
import { isParentNode, isValueNode } from './types';
import { JsonError } from 'json-schema-library';

describe('isParentNode', () => {
    it('should return false if value is undefined', () => {
        assert.equal(isParentNode(undefined), false);
    });
    it('should return false if value is null', () => {
        assert.equal(isParentNode(null), false);
    });
    it('should return false if value is true', () => {
        assert.equal(isParentNode(true), false);
    });
    it('should return false if value is {}', () => {
        assert.equal(isParentNode({}), false);
    });
    it('should return false if value is an error', () => {
        const error: JsonError = {
            type: 'error',
            name: 'test-error',
            code: 'testError',
            message: 'error message',
            data: { pointer: '#', schema: {}, value: false }
        };
        assert.equal(isParentNode(error), false);
    });
    it('should return false if value is valueNode', () => {
        assert.equal(isParentNode({ type: 'string', schema: { type: 'string' }, value: 'string value' }), false);
    });
    it('should return true if value is an arrayNode', () => {
        assert.equal(isParentNode({ type: 'array', schema: { type: 'array' } }), true);
    });
    it('should return true if value is an objectNode', () => {
        assert.equal(isParentNode({ type: 'array', schema: { type: 'array' } }), true);
    });
});

describe('isValueNode', () => {
    it('should return false if value is undefined', () => {
        assert.equal(isValueNode(undefined), false);
    });
    it('should return false if value is null', () => {
        assert.equal(isValueNode(null), false);
    });
    it('should return false if value is true', () => {
        assert.equal(isValueNode(true), false);
    });
    it('should return false if value is {}', () => {
        assert.equal(isValueNode({}), false);
    });
    it('should return false if value is an error', () => {
        const error: JsonError = {
            type: 'error',
            name: 'test-error',
            code: 'testError',
            message: 'error message',
            data: { pointer: '#', schema: {}, value: false }
        };
        assert.equal(isValueNode(error), false);
    });
    it('should return false if value is an arrayNode', () => {
        assert.equal(isValueNode({ type: 'array', schema: { type: 'array' } }), false);
    });
    it('should return false if value is an objectNode', () => {
        assert.equal(isValueNode({ type: 'array', schema: { type: 'array' } }), false);
    });
    it('should return true if value is stringNode', () => {
        assert.equal(isValueNode({ type: 'string', schema: { type: 'string' }, value: 'string value' }), true);
    });
    it('should return true if value is nullNode', () => {
        assert.equal(isValueNode({ type: 'null', schema: { type: 'null' }, value: null }), true);
    });
    it('should return true if value is booleanNode', () => {
        assert.equal(isValueNode({ type: 'boolean', schema: { type: 'boolean' }, value: false }), true);
    });
});
