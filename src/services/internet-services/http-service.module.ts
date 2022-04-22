import axios from "axios";

export const get = async (path: string): Promise<any> => {
    return await axios.get("https://atlantis-node-server.herokuapp.com" + path);
}

export const post = async (path: string, data: any): Promise<any> => {
    return await axios.post("https://atlantis-node-server.herokuapp.com" + path, data,
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
}

export const patch = async (path: string, id: string, data: any): Promise<any> => {
    return await axios.post("https://atlantis-node-server.herokuapp.com" + path + "/" + id, data,
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
}

export const deleteData = async (path: string, id: string): Promise<any> => {
    return await axios.post("https://atlantis-node-server.herokuapp.com" + path + "/" + id,
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
}