import React, { Component } from "react";
import API from "../utils/API";
import { Home } from "./Home";
import { Login } from "./Login";
import { Registration } from "./Registration";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


export class Base extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            currentUser: null
        }
    }

    userCallbackFromLogin = (user) => {
        this.setState({currentUser: user});
    }

    componentDidMount() {
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                    <Link to="/" className="navbar-brand">CampusWriters</Link>
                    <div className="collpase navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                        {/* <li className="navbar-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li> */}
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link">Log In</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/registration" className="nav-link">Registration</Link>
                            </li>
                        </ul>
                    </div>
                    </nav>
                    {/* A <Switch> looks through its children <Route>s and
                        renders the first one that matches the current URL. */}
                    <Switch>
                    <Route path="/login">
                        <Login loginCallback={this.userCallbackFromLogin} />
                    </Route>
                    <Route path="/">
                        <Home currentUser={this.state.currentUser}/>
                    </Route>
                    <Route path="/registation">
                        <Registration/>
                    </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}


