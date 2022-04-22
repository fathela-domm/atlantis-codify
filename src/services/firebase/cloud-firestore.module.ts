import firebase from "./firebase.config";

class FirestoreService {
    db = firebase.firestore();
    get(collection: string) {
        let didTimeout = false;
        return new Promise((resolve: any, reject: any) => {
            (async () => {
                const timeout = setTimeout(() => {
                    didTimeout = true;
                    reject(new Error("Request timeout, please try again"));
                }, 60000);

                try {
                    const totalQuery = await this.db.collection(collection).get();
                    const total = totalQuery.docs.length;
                    const query = this.db
                        .collection(collection)
                        .orderBy(firebase.firestore.FieldPath.documentId())
                        .limit(12);
                    const snapshot = await query.get();

                    clearTimeout(timeout);
                    if (!didTimeout) {
                        const data: any = [];
                        snapshot.forEach((doc: firebase.firestore.DocumentSnapshot) =>
                            data.push({ id: doc.id, ...doc.data() })
                        );
                        const lastKey = snapshot.docs[snapshot.docs.length - 1];
                        resolve({ data, lastKey, total });
                    }
                } catch (e: any) {
                    if (didTimeout) return;
                    reject(e?.message || ":( Failed to fetch users.");
                }
            })();
        });
    }

    getSingleDocument(collection: string, id: any) {
        return this.db.collection(collection)
            .doc(id)
            .get();
    }

    update(collection: string, id: any, data: any) {
        return this.db.collection(collection)
            .doc(id)
            .update(data);
    }

    create(collection: string, data: any) {
        return this.db.collection(collection)
            .add(data)
    }

    removeOne(collection: string, id: any) {
        return this.db.collection(collection).doc(id).delete();
    }
}

export default new FirestoreService();