import { database } from "./firebase.config";
export const databaseRef = database()?.ref("/");

export function create(path: string, data: any) {
    return databaseRef.child(path).push(data);
}

export function update(path: string, data: any) {
    return databaseRef.child(path).update(data);
}

export function get(path: string) {
    return databaseRef.once("value");
}

export function remove(path: string) {
    return databaseRef.child(path).remove();
}