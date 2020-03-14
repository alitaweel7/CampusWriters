import React, { Component } from "react";
import API from "../utils/API"

export class Registration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: "",
            school: "",
            bio: "",
        };
        console.log(props);
    }

    handleClick(event) {
        var invalidForm = false;
        if (this.state.username === "" || this.state.password === "" || this.state.email === "" || this.state.school === "" || this.state.bio === "") {
            alert("Please fill out all fields before submitting a new registration");
            invalidForm = true;
        }
        if (!invalidForm) {
            var payload = {
                "username": this.state.username,
                "password": this.state.password,
                "email": this.state.email,
                "school": this.state.school,
                "bio": this.state.bio
            }
            console.log(payload);
            API.registerNewUser(payload).then(res => {
                this.props.history.push('/login');
            }).catch(err => {
                if (err.status !== 200) {
                    alert(err.response?.data);
                }
            })
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Registration</h1>
                    <div className="form-group">
                        <label>Username: </label>
                        <br />
                        <input
                            type="text"
                            placeholder="select a username"
                            onChange={(event) => { this.setState({ username: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Email: </label>
                        <br />
                        <input
                            type="text"
                            placeholder="enter your email"
                            onChange={(event) => { this.setState({ email: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Password: </label>
                        <br />
                        <input
                            type="password"
                            placeholder="select your password"
                            onChange={(event) => { this.setState({ password: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>School: </label>
                        <br />
                        <input
                            type="text"
                            placeholder="enter your email"
                            onChange={(event) => { this.setState({ school: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Bio: </label>
                        <br />
                        <input
                            type="textarea"
                            placeholder="enter your email"
                            onChange={(event) => { this.setState({ bio: event.target.value }) }}
                        />
                    </div>
                    <br />
                    <button onClick={(event) => this.handleClick(event)}> Register </button>
                </div>
            </div>
        );
    }
}