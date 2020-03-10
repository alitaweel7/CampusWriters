import React, { Component } from "react";
import API from "../utils/API"

export class Home extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        API.getAll().then(res => {
            console.log(res.data.data)
            this.setState({ users: res.data.data })
        })
    }

    render() {
        return (
            <div>
                <h1>Home</h1>
                {this.state.users ? this.state.users.map(user =>
                    <p key={user._id}>{user.username}</p>
                ) : <h1>No users found</h1>}
            </div>
        )
    }
}


