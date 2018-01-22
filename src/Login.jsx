import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Col, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

let PLUGIN_ID;
if (process.env.NODE_ENV === 'debug') {
	PLUGIN_ID = 'mbmagclhdniafnleknagfkhnihgdfipo';
} else {
	PLUGIN_ID = 'fopllklfdgccljiagdpeocpdnhlmlakc';
}

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			credential : {
				username : '',
				password : ''
			},
			message: null,
			isLoggedIn : false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleGitHub = this.handleGitHub.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			this.setState(prevState => {
				return {
					credential : prevState.credential,
					isLoggedIn : response.isLoggedIn,
					message: null
				};
			});
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		var button = document.getElementById('loginButton');
		var span = document.createElement('span');
		span.setAttribute('class', 'glyphicon glyphicon-refresh glyphicon-refresh-animate');
		button.insertBefore(span, button.firstChild);
		var credential = {
			username: document.getElementById('username').value,
			password: document.getElementById('password').value
		};
		chrome.runtime.sendMessage({ kind: 'login' , credential: credential }, (response) => {
			console.log(`isLogged:${response.isLoggedIn}`);
			if (response.isLoggedIn) {
				this.setState(() => {
					return {
						credential: credential,
						isLoggedIn : true,
						message : null
					};
				});
				button.removeChild(span);
			} else {
				this.setState(() => {
					return {
						credential: credential,
						isLoggedIn : false,
						message : 'Invalid username or password.'
					};
				});
				button.removeChild(span);
			}
		});
	}

	handleGitHub(event) {
		event.preventDefault();
		const gitHubOAuthURL = `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=https://${PLUGIN_ID}.chromiumapp.org/github&scope=user:email`;
		chrome.identity.launchWebAuthFlow(
			{'url': gitHubOAuthURL, 'interactive': true},
			function(redirect_url) { /* Extract token from redirect_url */ 
				console.log(JSON.stringify(redirect_url));
			}
		);
	}

	render() {
		if (this.state.isLoggedIn) {
			return <Redirect to="/record"/>;
		} else {
			return (
				<Form horizontal onSubmit={this.handleSubmit}>
					<FormGroup>
						<Col xs={2}><ControlLabel>Username</ControlLabel></Col>
						<Col xs={10}>
							<FormControl id="username" type="text" value={this.state.username}/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col xs={2}><ControlLabel>Password</ControlLabel></Col>
						<Col xs={10}>
							<FormControl id="password" type="password" value={this.state.password}/>
						</Col>
					</FormGroup>
					{this.state.message &&
						<FormGroup>
							<Col xsOffset={2} xs={10}><Alert bsStyle="danger">{this.state.message}</Alert></Col>
						</FormGroup>
					}
					<FormGroup>
						<Col xsOffset={2} xs={10}><Button id="loginButton" bsStyle="primary" type="submit">Login</Button></Col>
					</FormGroup>
					<a href="#" onClick={this.handleGitHub}> Or Log With Your GitHub Account </a>
				</Form>
			);
		}

	}
}
