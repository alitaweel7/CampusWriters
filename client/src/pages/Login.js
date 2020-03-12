import React, { Component, useState } from "react";
import API from "../utils/API"



export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            username: "",
            password: "",
            currentUser: null,
        }
    }

    handleClick(event) {
        console.log(this.state);
        var payload = {
            "username": this.state.username,
            "password": this.state.password
        }
        console.log(payload);
        API.attemptLogin(payload).then(res => {
            this.setState({ currentUser: res.data.data });
            this.props.loginCallback(this.state.currentUser);
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Login</h1>
                    <div className="form-group">
                        <label>Username: </label>
                        <br />
                        <input
                            type="text"
                            placeholder="enter your username"
                            onChange={(event) => { this.setState({ username: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Password: </label>
                        <br />
                        <input
                            type="text"
                            placeholder="enter your password"
                            onChange={(event) => { this.setState({ password: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <button onClick={(event) => this.handleClick(event)}> Login </button>
                </div>
            </div>
        )
    }
}