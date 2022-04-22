import capacitorStorageService from "../services/storage/capacitor-storage.module";
import { get, create } from "../services/firebase/database.module";

export const setUser = async (userObject: any) => {
    return await capacitorStorageService.create("user", userObject)
        .catch((err: any) => console.error(err));
}

const createUser = (userObject: any) => {
    create("/users", userObject)
        .then((res: any) => {
            setUser(userObject);
        })
        .catch((err: any) => console.error(err));
}

export const authorizeUser = (userObject: any) => {
    let data: any;
    let documentSnapshot: any[] = [];
    return get("/users")
        .then((snapshot: any) => {
            for (let id in snapshot.val()) {
                Object.keys(snapshot.val()[id])
                    .map(key => {
                        documentSnapshot.push({ ...snapshot.val()[id][key], id: key });
                        // too acommodate those who signed in with both phone and email
                        if (snapshot.val()[id][key]["email"] == userObject["email"]) {
                            data = { ...snapshot.val()[id][key] };
                        }
                        else if (userObject["phoneNo"] && snapshot.val()[id][key]["phoneNo"] == userObject["phoneNo"] && snapshot.val()[id][key]["phoneNo"] !== "" && userObject["phoneNo"].length !== 0) {
                            data = { ...snapshot.val()[id][key] };
                        }
                    });
            }

        })
        .then((res: any) => {
            if (documentSnapshot.length === 0) {
                return createUser(userObject)
            }
            if (data) {
                return setUser(data);
            }
            else {
                return createUser(userObject)
            }
        })
        .catch((err: any) => console.error(err));
}

export const handleDBChange = (userObject: any) => {
    let data: any;
    let documentSnapshot: any[] = [];
    return get("/users")
        .then((snapshot: any) => {
            for (let id in snapshot.val()) {
                Object.keys(snapshot.val()[id])
                    .map((key: any) => {
                        documentSnapshot.push({ ...snapshot.val()[id][key], id: key });
                        if (snapshot.val()[id][key]["email"] == userObject["email"]) {
                            data = { ...snapshot.val()[id][key] };
                        }
                        else if (snapshot.val()[id][key]["phoneNo"] == userObject["phoneNo"] && snapshot.val()[id][key]["phoneNo"] !== "" && userObject["phoneNo"].length !== 0) {
                            data = { ...snapshot.val()[id][key] };
                        }
                    });
            }
        })
        .then(async (res: any) => {
            if (data) {
                await setUser(data)
            } else {
                authorizeUser(userObject);
            }
        })
        .catch((err: any) => console.error(err));
}

export const checkPriviledges = (userObject: any) => {
    let data: any;
    let documentSnapshot: any[] = [];
    return get("/users")
        .then((snapshot: any) => {
            for (let id in snapshot.val()) {
                Object.keys(snapshot.val()[id])
                    .map((key: any) => {
                        documentSnapshot.push({ ...snapshot.val()[id][key], id: key });
                        if (snapshot.val()[id][key]["email"] == userObject["email"]) {
                            data = { ...snapshot.val()[id][key] };
                        }
                        else if (snapshot.val()[id][key]["phoneNo"] == userObject["phoneNo"] && snapshot.val()[id][key]["phoneNo"] !== "" && userObject["phoneNo"].length !== 0) {
                            data = { ...snapshot.val()[id][key] };
                        }
                    });
            }
        })
        .then(async (res: any) => {
            if (data) {
                await setUser(data)
            }
        })
        .catch((err: any) => console.error(err));
}