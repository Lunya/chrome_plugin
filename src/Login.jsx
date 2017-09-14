import React from 'react';
import {login} from './AuthService.js';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			credential : {
				username : '',
				password :''
			},
			isLoggedIn : false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
    
	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			this.setState( (prevState) => {
				return {
					credential : prevState.credential,
					isLoggedIn : response.isLoggedIn
				};
			});
		});
	}

	handleChange(event) {
		console.log('handleChange');
		var eventID = event.target.id;
		var eventValue = event.target.value;   
		this.setState( (prevState) => {
			switch (eventID) {
			case 'username' : return { 
				credential: {
					username: eventValue, 
					password: prevState.credential.password
				}
			};
			case 'password' : return {
				credential: {
					username: prevState.credential.username, 
					password: eventValue
				}};
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		login(this.state.credential)
			.then( () => {
				console.log('connected !!!');
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						isLoggedIn : true
					};
				});
				chrome.runtime.sendMessage({kind:'nowIsLogin'});
			})
			.catch(err => {
				console.log(err);
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						isLoggedIn : false
					};
				});
				chrome.runtime.sendMessage({kind:'nowIsLogout'});
			});
	}

	render() {
		
		if (this.state.isLoggedIn) {
			return <div> You are logged ! </div>;
		} else {
			return (
				<form onSubmit={this.handleSubmit}>
					<div>
						<label>Username:</label>
						<input type="text" id="username" value={this.state.username} onChange={this.handleChange}/>
					</div>
					<div>
						<label>Password:</label>
						<input type="password" id="password" value={this.state.password} onChange={this.handleChange}/>
					</div>
					<div>
						<input type="submit" value="Log In"/>
					</div>
					<span>{this.state.message}</span>
				</form>
			);
		}
		
	}
}
