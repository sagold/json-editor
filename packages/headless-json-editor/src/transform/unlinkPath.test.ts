import { buildPathsMap } from './unlinkPath';
import { strict as assert } from 'assert';

describe('unlinkPaths.buildPathsMap', () => {
    it('should return path as map', () => {
        const map = buildPathsMap(['#/parent/child/node']);
        assert.deepEqual(map, { parent: { child: { node: { $return: true } } } });
    });

    it('should return multiple paths in map', () => {
        const map = buildPathsMap(['#/parent/child/node', '#/parent2/child/node']);
        assert.deepEqual(map, {
            parent: { child: { node: { $return: true } } },
            parent2: { child: { node: { $return: true } } }
        });
    });

    it('should merge share paths in map', () => {
        const map = buildPathsMap(['#/parent/child/node', '#/parent/child2/node']);
        assert.deepEqual(map, { parent: { child: { node: { $return: true } }, child2: { node: { $return: true } } } });
    });

    it('should have no duplicated paths in map', () => {
        const map = buildPathsMap(['#/parent/child/node', '#/parent/child/node']);
        assert.deepEqual(map, { parent: { child: { node: { $return: true } } } });
    });

    it('should set return statements to nested paths', () => {
        const map = buildPathsMap(['#/parent/child/node', '#/parent/child']);
        assert.deepEqual(map, { parent: { child: { $return: true, node: { $return: true } } } });
    });
});
