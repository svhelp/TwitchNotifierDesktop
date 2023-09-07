import { safeStorage } from "electron";
import { readStorage, removeStorage, writeStorage } from "./storage";

export const storageTokenKey = "accessToken";

export const initAccessToken = () => {
    const tokenData = readStorage<{type: string, data: number[]}>(storageTokenKey);

    if (!tokenData){
        return;
    }

    const token = Buffer.from(tokenData.data);
    const decryptedToken = safeStorage.decryptString(token);

    return decryptedToken;
}
  
export const updateAccessToken = (value: string | undefined) => {
    if (!value){
        removeStorage(storageTokenKey);
    } else {
        const encryptedToken = safeStorage.encryptString(value);
        writeStorage(storageTokenKey, encryptedToken);
    }
};

export const removeAccessToken = () => {
    removeStorage(storageTokenKey);
}