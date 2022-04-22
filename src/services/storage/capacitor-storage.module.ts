import { Storage } from "@ionic/storage";

class CapacitorStorage {
    store: Storage = new Storage();
    constructor() {
        this.store.create();
    }
    async get(key: string) {
        return await this.store.get(key);
    }

    async create(key: string, data: any) {
        return await this.store.set(
            key,
            { value: JSON.stringify(data) }
        )
    }

    async remove(key: string) {
        return await this.store.remove(key)
    }

    async clearStorage() {
        return await this.store.clear();
    }
}

export default new CapacitorStorage;