import React from 'react';
import {login} from './AuthService.js';
import { Redirect } from 'react-router-dom';

import { FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			credential : {
				username : '',
				password :''
			},
			message: null,
			isLoggedIn : false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
    
	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			console.log(`Login did mount ${response.isLoggedIn}`);
			this.setState( (prevState) => {
				return {
					credential : prevState.credential,
					isLoggedIn : response.isLoggedIn,
					message: null
				};
			});
		});
	}

	handleChange(event) {
		event.preventDefault();
		console.log('handleChange');
		var eventID = event.target.id;
		var eventValue = event.target.value;   
		this.setState( (prevState) => {
			switch (eventID) {
			case 'username' : return { 
				credential: {
					username: eventValue, 
					password: prevState.credential.password
				},
				isLoggedIn : prevState.isLoggedIn,
				message : prevState.message
			};
			case 'password' : return {
				credential: {
					username: prevState.credential.username, 
					password: eventValue,
				},
				isLoggedIn : prevState.isLoggedIn,
				message : prevState.message
			};
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		login(this.state.credential)
			.then( () => {
				console.log('connected !!!');
				chrome.runtime.sendMessage({kind:'nowIsLogin'});
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						isLoggedIn : true,
						message : null
					};
				});
			})
			.catch(err => {
				console.log(err);
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						isLoggedIn : false,
						message : 'username / password incorrect'
					};
				});
				chrome.runtime.sendMessage({kind:'nowIsLogout'});
			});
	}

	render() {
		if (this.state.isLoggedIn) {
			return <Redirect to="/record"/>;
		} else {
			let errorMessage;
			if  (this.state.message) {
				errorMessage = <Alert bsStyle="warning">
					<strong>{this.state.message}</strong>
				</Alert>;
			}
			return (
				<form onSubmit={this.handleSubmit}>
					<FormGroup>
						<ControlLabel>Username</ControlLabel>
						<FormControl id="username" type="text" value={this.state.username} onChange={this.handleChange}/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Password</ControlLabel>
						<FormControl id="password" type="password" value={this.state.password} onChange={this.handleChange}/>
					</FormGroup>
					<Button type="submit">Log In</Button>
					{errorMessage}
				</form>
			);
		}
		
	}
}
