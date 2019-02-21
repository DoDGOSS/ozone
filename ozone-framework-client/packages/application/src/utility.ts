export function lazy<T>(factory: () => T): () => T {
    let instance: T | undefined;
    return () => {
        if (!instance) {
            instance = factory();
        }
        return instance;
    };
}
