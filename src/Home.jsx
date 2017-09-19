import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect } from 'react-router-dom';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn : false
		};
	}

	componentDidMount() {
		console.log('Home didMount');
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			this.setState( () => {
				return {
					isLoggedIn : response.isLoggedIn
				};
			});
		});
	}

	render() {
		console.log(`render home: ${this.state.isLoggedIn}`);
		if (this.state.isLoggedIn) {
			return <Redirect to="/record"/>;
		}
		else {
			return <LinkContainer to="/login"><Button>Log in !</Button></LinkContainer>;
		}
	}

}
