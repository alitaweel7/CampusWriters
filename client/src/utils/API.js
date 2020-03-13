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
    },
    registerNewUser: (payload) => {
        console.log(payload);
        return axios.post('api/users/new', payload);
    },
    createNewInterview: (payload) => {
        console.log(payload);
        return axios.post('api/interviews/new', payload)
    },
    getInterviewByUser: (payload) => {
        console.log(payload);
        return axios.post('api/interviews/getAll', payload)
    }
}