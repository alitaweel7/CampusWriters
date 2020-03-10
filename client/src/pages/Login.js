import React, { Component } from "react";

export class Login extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    }
    render() {
        return (<h1>This is the login page</h1>)
    }
}