import axios from "axios";


export default {
    getAll: () => {
        return axios.get("/api/users/all")
    },
    getOne: (query) => {
        return axios.post("/url", { query: query })
    }
}