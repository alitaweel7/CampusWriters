import React, { Component } from "react";
import API from "../utils/API"

export class AddInterview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            description: "",
            body: "",
            tagList: "",
            currentUser: this.props.currentUser
        };
        console.log(props);
    }

    componentDidMount() {
        if(this.state.currentUser == null){
            this.props.history.push('login');
        }
    }

    handleClick(event){
        var invalidForm = false;
        if( this.state.title === "" || this.state.description === "" || this.state.body === "" || this.state.tagList === ""){
            alert("Please fill out all fields before submitting a new Interview");
            invalidForm = true;
        }
        if(!invalidForm){
            var tagList = this.state.tagList.split(',');
            var payload = {
                "title" : this.state.title,
                "description" : this.state.description,
                "body": this.state.body,
                "tagList" : tagList,
                "authorId" : this.state.currentUser?._id
            }
            console.log(payload);

            API.createNewInterview(payload).then(res => {
                this.props.history.push('/');
            }).catch(err => {
                if(err.status !== 200){
                    alert(err.response?.data);
                }
            });
        }
    }

    render(){
        return (
            <div>
                <div>
                    <h1>Add Interview</h1>
                    <div className="form-group">
                        <label>Title: </label>
                        <br/>
                        <input
                            type="text"
                            placeholder="enter a title"
                            onChange = { (event) => { this.setState({title: event.target.value})} }
                            />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label>Description: </label>
                        <br/>
                        <input
                            type="text"
                            placeholder="enter a description"
                            onChange = { (event) => { this.setState({description: event.target.value})} }
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label>Body: </label>
                        <br/>
                        <textarea
                            type="text"
                            onChange = { (event) => { this.setState({body: event.target.value})} }
                        />
                    </div>
                    <br/>
                    <div className="form-group">
                        <label>Tags </label>
                        <br/>
                        <input
                            type="text"
                            width="20%"
                            placeholder="comma delimited tags"
                            onChange = { (event) => { this.setState({tagList: event.target.value})} }
                        />
                    </div>
                    <br/>
                    <button onClick={(event) => this.handleClick(event)}> Create Interview </button>
                </div>
            </div>
        );
    }
}