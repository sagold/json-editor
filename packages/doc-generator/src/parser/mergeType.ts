import {
    IntersectionType,
    isIntersectionType,
    isTypeAliasDeclaration,
    isTypeLiteral,
    isTypeReference,
    Result,
    TypeLiteral,
    TypeReference
} from './types';
import { KindName } from './utils/getKindName';

const expectedTypes: KindName[] = ['IntersectionType', 'TypeAliasDeclaration', 'TypeLiteral', 'TypeReference'];

type Context = {
    parseResult: Record<string, Result>;
};

/**
 * Merges a type tree to a single TypeLiteral or IntersectionType
 *
 * # Resolves TypeReferences if they are explicitely passed
 * if a TypeReference is encountered, but not set to resolve, will return a IntersectionType
 * Access types and TypeReferences on "types"
 *
 * # Merges all nested type declarations
 * if all TypeReferences could be resolved, returns a TypeLiteral. Access types on "properties"
 *
 * @returns merged input type;
 */
export function mergeType(
    context: Context,
    inputType: Result,
    // TypeParameter OR TypeArguments?
    args: Result[] = []
): undefined | TypeLiteral | IntersectionType | TypeReference {
    if (inputType == null || inputType.kindName == null || !expectedTypes.includes(inputType.kindName)) {
        console.log(`[mergeToSingleType] unexpected type '${inputType?.kindName}'`);
        return undefined;
    }

    if (isTypeAliasDeclaration(inputType)) {
        // let us check if we have typeArguments passed on to parameters
        const typeParameters = (inputType.typeParameters ?? []).map((param, index) => {
            return { ...(args[index] ?? {}), parameterName: param.name };
        });
        return mergeType(context, inputType.type, typeParameters);
    }

    if (isIntersectionType(inputType)) {
        const references: TypeReference[] = [];
        const intersectionTypes: IntersectionType[] = [];
        const typeLiteral: TypeLiteral = {
            kindName: 'TypeLiteral',
            properties: []
        };
        inputType.types
            .map((t) => mergeType(context, t, args))
            .forEach((t) => {
                if (isTypeReference(t)) {
                    references.push(t);
                } else if (isTypeLiteral(t)) {
                    typeLiteral.properties!.push(...(t.properties ?? []));
                } else if (isIntersectionType(t)) {
                    t.types.forEach((itype) => {
                        if (isTypeReference(itype)) {
                            references.push(itype);
                        } else if (isTypeLiteral(itype)) {
                            typeLiteral.properties!.push(...(itype.properties ?? []));
                        } else {
                            console.log('IMPLEMENT nested UNDEFINED BEHAVIOUR', t?.kindName);
                        }
                    });
                } else {
                    console.log('IMPLEMENT UNDEFINED BEHAVIOUR', t);
                }
            });

        if (intersectionTypes.length > 0) {
            const finalType: IntersectionType = {
                kindName: 'IntersectionType',
                types: [...references]
            };
            if (typeLiteral.properties!.length > 0) {
                finalType.types.unshift(typeLiteral);
            }
            return finalType;
        }

        if (references.length === 0) {
            return typeLiteral;
        } else {
            return {
                // reference: inputType,
                kindName: 'IntersectionType',
                types: [typeLiteral, ...references]
            } as IntersectionType;
        }
    }

    if (isTypeLiteral(inputType)) {
        // there might be type references to arguments in PropertySignature.type
        // we resolve them too
        if (args.length > 0) {
            const typeLiteral: TypeLiteral = {
                ...inputType,
                properties: inputType.properties?.map((prop) => {
                    if (prop.type?.kindName === 'TypeReference') {
                        prop.type = mergeType(context, prop.type, args) ?? prop.type;
                        // @ts-expect-error meta
                        delete prop.type?.parameterName;
                    }
                    return prop;
                })
            };
            return typeLiteral;
        }
        return inputType;
    }

    if (isTypeReference(inputType)) {
        const reference =
            // @ts-expect-error meta
            args?.find((t) => t.parameterName === inputType.name || t.name === inputType.name) ??
            context.parseResult[inputType.name];

        if (reference == null || reference === inputType) {
            console.log(`failed resolving reference -- skipping '${inputType.name}'`);
            return inputType;
        }

        const mergeResult = mergeType(context, reference, inputType.typeArguments ?? args);
        if (mergeResult != null) {
            return mergeResult;
        }

        console.log('failed merging type reference');
        return inputType;
    }

    throw new Error(`[margeType] unhandled type ${inputType.name}`);
}
