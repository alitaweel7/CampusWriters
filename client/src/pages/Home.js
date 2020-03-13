import React, { Component } from "react";
import API from "../utils/API";

export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            interviews: [],
            currentUser: this.props.currentUser
        }
    }

    componentDidMount() {
        console.log(this.props);
        console.log(this.state.currentUser);
        if(this.state.currentUser == null){
            this.props.history.push('login');
        }
        else{
            API.getInterviewByUser({userId: this.state.currentUser._id}).then(res => {
                console.log(res.data.data)
                this.setState({ interviews: res.data.data })
            }).catch(err => {
                console.log(err.response?.data);
            });
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <h3>Hello {this.state.currentUser?.username}</h3>
                        <h6>{this.state?.currentUser?.email}</h6>
                        <br/>


                        <h3>My Interviews: </h3>
                        {this.state.interviews ? this.state.interviews.map(interview =>
                            <div key={interview._id}>
                                <div className="row">
                                    <div className="xs-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h2>{interview.title}</h2>
                                                <h6>By {this.state.currentUser.username}</h6>
                                            </div>
                                            <div className="card-body">
                                                <p>{interview.body}</p>
                                            </div>
                                            <div className="card-footer">
                                                <ul>
                                                    {interview.tagList.map(tag => 
                                                        <li>{tag}</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        ) : <h1>No interviews found</h1>}
                    </div>
                </div>
            </div>
        )
    }
}
