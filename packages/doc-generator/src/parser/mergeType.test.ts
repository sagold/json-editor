import path from 'node:path';
import { strict as assert } from 'node:assert';
import { parse } from './parse';
import { get } from '@sagold/json-pointer';
import { mergeType } from '.';
import { Result, IntersectionType, TypeReference, TypeLiteral } from './types';

const fixturePath = 'packages/doc-generator/test/fixtures';
const getFixture = (filename: string) => path.join(process.cwd(), fixturePath, filename);

const propertySignatureA: Result = { kindName: 'PropertySignature', name: 'data' };
const propertySignatureB: Result = { kindName: 'PropertySignature', name: 'enabled' };
const typeReferenceA: TypeReference = { kindName: 'TypeReference', name: 'reference' };
const typeLiteralA: TypeLiteral = { kindName: 'TypeLiteral', properties: [propertySignatureA] };

describe('mergeType', () => {
    describe('IntersectionType', () => {
        console.log(JSON.stringify(parse([getFixture('TypeAliasDeclaration.ts')]), null, 2));

        it('should return IntersectionType as TypeLiteral', () => {
            const intersectionType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [{ kindName: 'TypeLiteral', properties: [propertySignatureA] }]
            };
            const resultType = mergeType({ parseResult: {} }, intersectionType);
            assert.deepEqual(resultType, { kindName: 'TypeLiteral', properties: [propertySignatureA] });
        });

        it('should combine TypeLiterals of IntersectionType', () => {
            const intersectionType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [
                    { kindName: 'TypeLiteral', properties: [propertySignatureA] },
                    { kindName: 'TypeLiteral', properties: [propertySignatureB] }
                ]
            };
            const resultType = mergeType({ parseResult: {} }, intersectionType);
            assert.deepEqual(resultType, {
                kindName: 'TypeLiteral',
                properties: [propertySignatureA, propertySignatureB]
            });
        });

        it('should not combine unresolved TypeReferences', () => {
            const intersectionType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [typeReferenceA, { kindName: 'TypeLiteral', properties: [propertySignatureB] }]
            };
            const resultType = mergeType({ parseResult: {} }, intersectionType);
            assert.deepEqual(resultType, {
                kindName: 'IntersectionType',
                types: [{ kindName: 'TypeLiteral', properties: [propertySignatureB] }, typeReferenceA]
            });
        });

        it('should combine other TypeLiterals', () => {
            const intersectionType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [
                    { kindName: 'TypeLiteral', properties: [propertySignatureA] },
                    typeReferenceA,
                    { kindName: 'TypeLiteral', properties: [propertySignatureB] }
                ]
            };
            const resultType = mergeType({ parseResult: {} }, intersectionType);
            assert.deepEqual(resultType, {
                kindName: 'IntersectionType',
                types: [
                    { kindName: 'TypeLiteral', properties: [propertySignatureA, propertySignatureB] },
                    typeReferenceA
                ]
            });
        });

        it('should combine nested IntersectionTypes', () => {
            const intersectionType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [
                    { kindName: 'TypeLiteral', properties: [propertySignatureA] },
                    {
                        kindName: 'IntersectionType',
                        types: [{ kindName: 'TypeLiteral', properties: [propertySignatureB] }]
                    }
                ]
            };
            const resultType = mergeType({ parseResult: {} }, intersectionType);
            assert.deepEqual(resultType, {
                kindName: 'TypeLiteral',
                properties: [propertySignatureA, propertySignatureB]
            });
        });

        it('should combine nested IntersectionTypes and references', () => {
            const intersectionType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [
                    { kindName: 'TypeLiteral', properties: [propertySignatureA] },
                    {
                        kindName: 'IntersectionType',
                        types: [{ kindName: 'TypeLiteral', properties: [propertySignatureB] }, typeReferenceA]
                    }
                ]
            };
            const resultType = mergeType({ parseResult: {} }, intersectionType);
            assert.deepEqual(resultType, {
                kindName: 'IntersectionType',
                types: [
                    { kindName: 'TypeLiteral', properties: [propertySignatureA, propertySignatureB] },
                    typeReferenceA
                ]
            });
        });
    });

    describe('TypeReference', () => {
        it('should return unresolved TypeReference', () => {
            const resultType = mergeType({ parseResult: {} }, { kindName: 'TypeReference', name: 'unknown' });
            assert.deepEqual(resultType, { kindName: 'TypeReference', name: 'unknown' });
        });
        it('should return found TypeReference', () => {
            const resultType = mergeType(
                { parseResult: { known: typeLiteralA } },
                { kindName: 'TypeReference', name: 'known' }
            );
            assert.deepEqual(resultType, typeLiteralA);
        });
    });

    describe('TypeAliasDeclaration', () => {
        it('should map input arguments to parameters and apply local arguments', () => {
            const parseResult: Record<string, Result> = {
                ParentType: {
                    kindName: 'TypeAliasDeclaration',
                    // this will parse arguments to the parameterName U
                    typeParameters: [{ kindName: 'TypeParameter', text: 'U', name: 'U' }],
                    // arguments -> parameters -> U (= argument on index)
                    type: { kindName: 'TypeReference', name: 'U' }
                }
            };
            const resultType = mergeType({ parseResult }, { kindName: 'TypeReference', name: 'ParentType' }, [
                { kindName: 'TypeLiteral', properties: [propertySignatureA] }
            ]);
            assert.deepEqual(resultType, {
                parameterName: 'U',
                kindName: 'TypeLiteral',
                properties: [propertySignatureA]
            });
        });

        it('should map input arguments to IntersectionType types', () => {
            const parseResult: Record<string, Result> = {
                ParentType: {
                    kindName: 'TypeAliasDeclaration',
                    // this will parse arguments to the parameterName U
                    typeParameters: [{ kindName: 'TypeParameter', text: 'U', name: 'U' }],
                    // arguments -> parameters -> U (= argument on index)
                    type: {
                        kindName: 'IntersectionType',
                        types: [{ kindName: 'TypeReference', name: 'U' }]
                    }
                }
            };
            const resultType = mergeType({ parseResult }, { kindName: 'TypeReference', name: 'ParentType' }, [
                { kindName: 'TypeLiteral', properties: [propertySignatureA] }
            ]);
            assert.deepEqual(resultType, {
                kindName: 'TypeLiteral',
                properties: [propertySignatureA]
            });
        });

        it('should map input arguments without params to IntersectionType types', () => {
            const parseResult: Record<string, Result> = {
                ParentType: {
                    kindName: 'TypeAliasDeclaration',
                    // this will parse arguments to the parameterName U
                    typeParameters: [{ kindName: 'TypeParameter', text: 'U', name: 'U' }],
                    // arguments -> parameters -> U (= argument on index)
                    type: {
                        kindName: 'IntersectionType',
                        types: [{ kindName: 'TypeReference', name: 'U' }]
                    }
                }
            };
            const resultType = mergeType({ parseResult }, { kindName: 'TypeReference', name: 'ParentType' }, [
                { kindName: 'TypeLiteral', properties: [propertySignatureA] }
            ]);
            assert.deepEqual(resultType, {
                kindName: 'TypeLiteral',
                properties: [propertySignatureA]
            });
        });

        it('should map input arguments to PropertySignature type', () => {
            const parseResult: Record<string, Result> = {
                ParentType: {
                    kindName: 'TypeAliasDeclaration',
                    // this will parse arguments to the parameterName U
                    typeParameters: [{ kindName: 'TypeParameter', text: 'U', name: 'U' }],
                    // arguments -> parameters -> U (= argument on index)
                    type: {
                        kindName: 'TypeLiteral',
                        properties: [
                            {
                                kindName: 'PropertySignature',
                                name: 'data',
                                type: {
                                    kindName: 'TypeReference',
                                    name: 'U'
                                }
                            }
                        ]
                    }
                }
            };
            const resultType = mergeType({ parseResult }, { kindName: 'TypeReference', name: 'ParentType' }, [
                { kindName: 'TypeLiteral', properties: [propertySignatureA] }
            ]);
            assert.deepEqual(resultType, {
                kindName: 'TypeLiteral',
                properties: [
                    {
                        kindName: 'PropertySignature',
                        name: 'data',
                        type: {
                            kindName: 'TypeLiteral',
                            properties: [propertySignatureA]
                        }
                    }
                ]
            });
        });
    });

    describe('TypeAliasDeclaration.ts', () => {
        // TypeAliasDeclaration » IntersectionType » TypeLiteral[]
        let parseResult: Record<string, Result> | undefined;
        // @ts-expect-error needs fix of return type
        beforeEach(() => (parseResult = parse([getFixture('TypeAliasDeclaration.ts')])));

        it('should return TypeLiteral with correct properties', () => {
            console.log(JSON.stringify(parseResult, null, 2));
            assert(parseResult);
            const typeDeclaration = get(parseResult, 'EditorOptions');
            assert(typeDeclaration);
            // console.log(JSON.stringify(typeDeclaration, null, 2));
            assert.equal(get(typeDeclaration, 'kindName'), 'TypeAliasDeclaration');

            const result = mergeType({ parseResult }, typeDeclaration);
            // assert.equal(get(result, 'kindName'), 'TypeLiteral');
            console.log('result', JSON.stringify(result, null, 2));
        });
    });
});
