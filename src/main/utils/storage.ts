import Store from 'electron-store';

export const readStorage = <T,>(key: string) => {
    const store = new Store();
    return store.get(key) as T | undefined;
}

export const writeStorage = <T,>(key: string, value: T) => {
    const store = new Store();
    store.set(key, value);
}

export const removeStorage = (key: string) => {
    const store = new Store();
    store.delete(key);
}