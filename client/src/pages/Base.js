import React, { Component } from "react";
import { Home } from "./Home";
import { Login } from "./Login";
import { Registration } from "./Registration";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";
import { AddInterview } from "./AddInterview";


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
        if(this.state.currentUser == null){
            return <Redirect to="/login" />
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                    <Link to="/" className="navbar-brand">CampusWriters</Link>
                    <div className="collpase navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/addInterview" className="nav-link">Create Interview</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/registration" className="nav-link">Registration</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link">Log In</Link>
                            </li>
                        </ul>
                    </div>
                    </nav>
                    {/* A <Switch> looks through its children <Route>s and
                        renders the first one that matches the current URL. */}
                    <Switch>
                    <Route 
                        path="/login" 
                        render={(props) => <Login {...props} loginCallback={this.userCallbackFromLogin} />}>
                    </Route>
                    <Route 
                        path="/registration" 
                        render={(props) => <Registration {...props} />}>
                    </Route>
                    <Route 
                        path="/addInterview" 
                        render={(props) => <AddInterview {...props} currentUser={this.state.currentUser} />}>
                    </Route>
                    <Route 
                        path="/" 
                        render={(props) => <Home {...props} currentUser={this.state.currentUser} />}>       
                    </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}


