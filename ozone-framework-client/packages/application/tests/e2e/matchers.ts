import { isArray } from "lodash";

declare global {
    namespace jest {
        interface Expect {
            arrayOfLength(length: number): void;
        }
        interface Matchers<R> {
            arrayOfLength(received: unknown, length: number): R;
        }
    }
}

expect.extend({
    arrayOfLength(received: unknown, length: number) {
        const pass = isArray(received) && received.length === length;

        if (pass) {
            return {
                message: () => `expected ${received} be array with length range ${length}`,
                pass: true
            };
        } else {
            return {
                message: () => `expected ${received} be array with length range ${length}`,
                pass: false
            };
        }
    }
});
