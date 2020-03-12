import React, { Component } from "react";
import API from "../utils/API"

export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            currentUser: this.props.currentUser
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
                <div>
                    <h1>Home</h1>
                    {this.state.users ? this.state.users.map(user =>
                        <p key={user._id}>{user.username}</p>
                    ) : <h1>No users found</h1>}
                </div>
                <div>
                    <h3>Current User</h3>
                    <p>{this.state?.currentUser?.username}</p>
                    <p>{this.state?.currentUser?.email}</p>
                </div>
            </div>
        )
    }
}


