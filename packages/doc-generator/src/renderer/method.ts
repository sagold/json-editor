import { APIDocs } from '../parser/parse';
import { codeBlock } from './codeBlock';
import { getTags } from './utils/getTags';
import { maybe } from './utils/maybe';

export const method = (method: APIDocs) => {
    const hasReturns = method.returns && method.returns !== '' && method.returns !== 'void';
    const caveat = getTags(method.tags, 'caveat');

    const doc = [
        `### \`${method.name}\``,
        '',
        // usage example
        codeBlock(method.text?.replace(/\s*{(.|\n)*$/, '')),
        // method description
        maybe('', method.comment),
        maybe(method.comment),
        maybe('', method.comment),
        maybe('#### Parameters', method.parameters?.length),
        '',
        ...(method.parameters?.map((param) => `- **\`${param.name}\`** ${param.comment ?? ''}`) ?? []),
        '',
        // returns
        maybe('#### Returns', hasReturns),
        maybe('', hasReturns),
        maybe(`**\`${method.returns.type}\`** ${method.returns?.comment ?? ''}`, hasReturns),
        maybe('', hasReturns),
        // caveat
        maybe('', caveat?.length),
        maybe('#### Caveats', caveat?.length),
        maybe('', caveat?.length),
        ...(caveat?.map((c) => `- ${c.comment}`) ?? []),
        maybe('', caveat?.length)
    ];

    return doc;
};
