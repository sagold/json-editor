import { strict as assert } from 'assert';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { render } from '@testing-library/react';
import { uuid } from 'headless-json-editor';

type Instance = null | { id: string };

function useRefTest() {
    const ref = useRef<Instance>(null);
    useEffect(() => {
        ref.current = { id: uuid() };
        return () => {
            ref.current = null;
        };
    }, [ref]);
    // eslint-disable-next-line react-hooks/refs
    return ref.current;
}

function useStateTest() {
    const [instance, setInstance] = useState<Instance>(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInstance({ id: uuid() });
        return () => setInstance(null);
    }, [setInstance]);
    return instance;
}

describe('useEffect', () => {
    describe('useRef', () => {
        it('should not render instance on first call', () => {
            const instanceCalls: Instance[] = [];
            function Form() {
                const editor = useRefTest();
                instanceCalls.push(editor);
                return <div>{editor?.id}</div>;
            }
            render(<Form />);
            assert.equal(instanceCalls.length, 1);
            assert(instanceCalls[0] == null);
        });

        it('should not render instance on first call in strict mode', () => {
            const instanceCalls: Instance[] = [];
            function Form() {
                const editor = useRefTest();
                instanceCalls.push(editor);
                return <div>{editor?.id}</div>;
            }
            render(
                <StrictMode>
                    <Form />
                </StrictMode>
            );
            assert.equal(instanceCalls.length, 2);
            assert(instanceCalls[0] == null);
            assert(instanceCalls[1] == null);
        });
    });

    describe('useState', () => {
        it('should render instance on first call', () => {
            const instanceCalls: Instance[] = [];
            function Form() {
                const editor = useStateTest();
                instanceCalls.push(editor);
                return <div>{editor?.id}</div>;
            }
            render(<Form />);
            assert.equal(instanceCalls.length, 2);
            assert(instanceCalls[0] == null);
            assert(instanceCalls[1] != null);
        });

        it('should initially render only twice, even if used multiple times', () => {
            const instanceCalls: Instance[] = [];
            function Form() {
                const editor = useStateTest();
                useStateTest();
                instanceCalls.push(editor);
                return <div>{editor?.id}</div>;
            }
            render(<Form />);
            assert.equal(instanceCalls.length, 2);
        });

        it('should render instance on first call in strict mode', () => {
            const instanceCalls: Instance[] = [];
            function Form() {
                const editor = useStateTest();
                instanceCalls.push(editor);
                return <div>{editor?.id}</div>;
            }
            render(
                <StrictMode>
                    <Form />
                </StrictMode>
            );
            assert.equal(instanceCalls.length, 4);
            assert(instanceCalls[0] == null);
            assert(instanceCalls[1] == null);
            assert(instanceCalls[2] != null);
            assert(instanceCalls[3] != null);
        });
    });
});
