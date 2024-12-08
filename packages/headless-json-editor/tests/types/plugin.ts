import { Node } from "../../src/types";
const node = {} as Node;



type Test = (a: string, b: number) => void;
export type Second = Parameters<Test>;



type PluginInstance<S extends Record<string, unknown> = Record<string, unknown>> = {
    id: string;
    onEvent: (root: Node) => void;
} & S;

type EditorPlugin<
    Options extends Parameters<EditorPlugin>[0] = any,
    Signature extends Record<string, unknown> = Record<string, unknown>,
> = (options: Options) => PluginInstance<Signature> | undefined;


function addPlugin<P extends EditorPlugin>(plugin: P, options?: Parameters<P>[0]) {
    const instance = plugin(options) as ReturnType<P>;
    return instance;
}



/** no options */
const NoOptions: EditorPlugin = () => ({
    id: "no-options",
    onEvent() {}
});

const noOptions = addPlugin(NoOptions);
// noOptions?.mimi(); // should fail
noOptions?.onEvent(node);



/** with options */
type Options = { msg: string };
const WithOptions: EditorPlugin<Options> = (options) => ({
    id: "with-options",
    onEvent(root) { console.log(root, options.msg); }
});

const withOptions = addPlugin(WithOptions, { msg: "title" });
// withOptions?.mimi(); // should fail
withOptions?.onEvent(node);
// withOptions = addPlugin(WithOptions, { msg: 123 }); // should fail


/** with signature */
type Signature = { log: () => void };
const WithSignature: EditorPlugin<Options, Signature> = ({ msg }) => ({
    id: "with-signature",
    onEvent(root) { console.log(root, msg); },
    /** console.log */
    log() {}
});

let withSignature = WithSignature({ msg: "test signature" });
withSignature?.onEvent(node);
withSignature?.log();

withSignature = addPlugin(WithSignature, { msg: "test signature" });
// withSignature?.mimi(); // should fail
withSignature?.onEvent(node);
withSignature?.log(); // should succeed
