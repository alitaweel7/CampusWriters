import axios from "axios";


export default {
    getAll: () => {
        return axios.get("/api/users/all")
    },
    getOne: (query) => {
        return axios.post("/url", { query: query })
    },
    attemptLogin: (payload) => {
        console.log(payload);
        return axios.post("/api/users/login", payload);
    }
}