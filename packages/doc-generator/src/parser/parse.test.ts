import path from 'node:path';
import { strict as assert } from 'node:assert';
import { parse } from './parse';
import { get } from '@sagold/json-pointer';
import query, { type Input } from '@sagold/json-query';

const getFixture = (filename: string) => {
    return path.join(process.cwd(), 'packages/doc-generator/test/fixtures', filename);
};

// https://ts-ast-viewer.com/#
describe('kindParser', () => {
    describe('VariableStatement » VariableDeclarationList » VariableDeclaration', () => {
        let parseResult: ReturnType<typeof parse> | undefined;
        beforeEach(() => (parseResult = parse([getFixture('Statement-DeclarationList-VariableDeclaration.ts')])));

        it("should return 'VariableDeclaration'", () => {
            const variable = get(parseResult, 'objectDeclaration');
            // console.log('variable', JSON.stringify(variable, null, 2));
            assert.equal(get(variable, 'kindName'), 'VariableDeclaration');
            assert.equal(get(variable, 'name'), 'objectDeclaration', "should return 'name:ObjectDeclaration'");
            assert(get(variable, 'comment'), "should return 'docs'");
            assert.equal(get(variable, 'isExported'), true, "should return 'isExported:true'");
            assert.equal(get(variable, 'isComponent'), false, "should return 'isComponent:false'");
            assert.equal(get(variable, 'type/name'), 'ObjectType', "should return 'type:ObjectType'");
            assert.equal(get<any[]>(variable, 'properties')?.length, 2, 'should return two properties');

            const property = get(variable, 'properties/1');
            assert.equal(get(property, 'value/kindName'), 'ArrowFunction', 'should return kindName of initializer');
            assert.equal(get(property, 'parameters/0/name'), 'params', 'parameter name');
        });

        // secondary check on TypeAliasDeclaration
        it("should return 'TypeAliasDeclaration'", () => {
            const type = get(parseResult, 'ObjectType');
            // console.log('variable', JSON.stringify(type, null, 2));
            assert.equal(get(type, 'kindName'), 'TypeAliasDeclaration');
            assert.equal(get(type, 'name'), 'ObjectType', "should return 'name:ObjectType'");
            assert(get(type, 'comment'), "should return 'docs'");
            assert(get(type, 'isExported') !== true, "should not return 'isExported:true'");
            assert.equal(get(type, 'type/kindName'), 'TypeLiteral', "should assign object definition on 'type'");

            const property = get(type, 'type/properties/1');
            assert(property, 'should have return a property list containing two item');
            assert.equal(get(property, 'type/kindName'), 'FunctionType', 'should return kindName property');
            assert.equal(get(property, 'type/parameters/0/name'), 'params', 'parameter name');
            assert.equal(
                get(property, 'type/parameters/0/comment'),
                'type comment',
                'should have added comment from @param'
            );
        });
    });

    describe('FunctionDeclaration', () => {
        let parseResult: ReturnType<typeof parse> | undefined;
        beforeEach(() => (parseResult = parse([getFixture('FunctionDeclaration.ts')])));

        it("should return 'FunctionDeclaration'", () => {
            const variable = get(parseResult, 'useHook');
            // console.log('variable', JSON.stringify(parseResult, null, 2));
            assert.equal(get(variable, 'kindName'), 'FunctionDeclaration');
            assert.equal(get(variable, 'name'), 'useHook');
            assert.equal(get(variable, 'isExported'), true, "should return 'isExported:true'");
            assert(get(variable, 'comment'), "should return 'docs'");
            assert.equal(get(variable, 'returns/type'), '{ type: string; data: Data; }', 'returns type');
            assert.equal(
                get(variable, 'returns/comment'),
                'returns an object with id = editor',
                'should have added comment from @returns'
            );
            assert.equal(
                get(variable, 'typeParameters/0/comment'),
                'The type of data passed to options.',
                'should have added comment from @template'
            );

            const typeParam = get(variable, 'typeParameters/0');
            assert(typeParam, 'type parameter');
            assert.equal(get(typeParam, 'name'), 'Data', 'type parameter name');

            const parameter = get(variable, 'parameters/0');
            assert(parameter, 'should have return a parameter list containing one item');
            assert.equal(get(parameter, 'name'), 'options', 'parameter name');
            assert.equal(get(parameter, 'type/name'), 'UseHookOptions', 'parameter type');
            assert.equal(get(parameter, 'type/typeArguments/0/name'), 'Data', 'parameter argument');
            assert.equal(get(parameter, 'comment'), 'hook options', 'should have added comment from @param');
        });

        // secondary check on TypeAliasDeclaration
        it("should return 'TypeAliasDeclaration'", () => {
            const type = get(parseResult, 'UseHookOptions');
            // console.log('variable', JSON.stringify(parseResult, null, 2));
            assert.equal(get(type, 'kindName'), 'TypeAliasDeclaration');
            assert.equal(get(type, 'name'), 'UseHookOptions', 'name');
            assert(get(type, 'comment'), "should return 'docs'");
            assert.equal(get(type, 'isExported'), true, "should return 'isExported:true'");
            assert.equal(get(type, 'type/kindName'), 'TypeLiteral', "should assign object definition on 'type'");
            assert.equal(get(type, 'typeParameters/0/kindName'), 'TypeParameter', 'should return TypeParameters');
            assert.equal(
                get(type, 'typeParameters/0/comment'),
                'the generic data type to use',
                'should have added comment from @template'
            );
        });
    });

    describe('ClassDeclaration', () => {
        let parseResult: ReturnType<typeof parse> | undefined;
        beforeEach(() => (parseResult = parse([getFixture('ClassDeclaration.ts')])));

        it("should return 'ClassDeclaration'", () => {
            const variable = get(parseResult, 'Editor');
            // console.log('variable', JSON.stringify(variable, null, 2));
            assert.equal(get(variable, 'kindName'), 'ClassDeclaration');
            assert.equal(get(variable, 'name'), 'Editor', 'name');
            assert(get(variable, 'comment'), "should return 'docs'");
            assert.equal(get(variable, 'isExported'), true, "should return 'isExported:true'");
            // merged constructor to class declaration
            assert.equal(get(variable, 'parameters/0/name'), 'options', 'constructor param');
            assert.equal(get(variable, 'parameters/0/type/name'), 'EditorOptions', 'constructor param type');
            // class method
            const getWidget = query.get(variable as Input, 'methods/*?name:getWidget', query.get.VALUE)?.[0];
            assert.equal(get(getWidget, 'kindName'), 'MethodDeclaration');
            assert.equal(get(getWidget, 'name'), 'getWidget');
            assert.equal(get(getWidget, 'returns/type'), 'WidgetComponent', 'return type');
            // inherited class method
            const inheritedMethod = query.get(variable as Input, 'methods/*?name:getSchema', query.get.VALUE)?.[0];
            assert.equal(get(inheritedMethod, 'kindName'), 'MethodDeclaration');
            assert.equal(get(inheritedMethod, 'name'), 'getSchema');
            assert.equal(get(inheritedMethod, 'returns/type'), 'JsonSchema', 'return type');
        });
    });

    describe('TypeAliasDeclaration', () => {
        // TypeAliasDeclaration » IntersectionType » TypeLiteral[]
        let parseResult: ReturnType<typeof parse> | undefined;
        beforeEach(() => (parseResult = parse([getFixture('TypeAliasDeclaration.ts')])));

        it("should return 'TypeAliasDeclaration'", () => {
            const variable = get(parseResult, 'EditorOptions');
            console.log('variable', JSON.stringify(variable, null, 2));
            assert.equal(get(variable, 'kindName'), 'TypeAliasDeclaration');
            assert.equal(get(variable, 'name'), 'EditorOptions', 'name');
            assert(get(variable, 'comment'), "should return 'docs'");
            assert.equal(get(variable, 'isExported'), true, "should return 'isExported:true'");

            // type parameters
            const typeParameters = get(variable, 'typeParameters');
            assert(Array.isArray(typeParameters), 'typeParameters should be an array');

            // type - actual type definition
            const type = get(variable, 'type');
            assert(type, 'should return type definition on "type"');
        });
    });
});
