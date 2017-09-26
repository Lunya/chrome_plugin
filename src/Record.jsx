import React from 'react';
import {postScenario, logout} from './services.js';
import { Redirect } from 'react-router-dom';
import { Row, Button } from 'react-bootstrap';

export default class Record extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: false,
			publish: true,
			reinit: true,
			redirect: false 
		};
		this.clickStart = this.clickStart.bind(this);
		this.clickPublish = this.clickPublish.bind(this);
		this.clickReinit = this.clickReinit.bind(this);
		this.clickLogout = this.clickLogout.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			this.setState( () => {
				return {
					start: response.isRecording ,
					publish: !response.isRecording ,
					reinit: !response.isRecording,
					redirect: false 
				};
			});
		});
	}

	clickStart(event) {
		event.preventDefault();
		chrome.runtime.sendMessage({kind:'start'});
		this.setState( (prevState) => {
			return {
				start: true ,
				publish: false ,
				reinit: false ,
				redirect: false 
			};
		});
	}

	clickPublish(event) {
		event.preventDefault();
		console.log('start publish');
		chrome.runtime.sendMessage({kind:'publish'}, recordedScenario => {
			console.log('publish ok');
			postScenario(recordedScenario)
				.then(() => {
					this.setState( (prevState) => {
						return {
							start: false ,
							publish: true ,
							reinit: true ,
							redirect: false
						};
					});
				})
				.catch( err => {
					console.log(err);
				});
		});
	}

	clickReinit(event) {
		event.preventDefault();
		chrome.runtime.sendMessage({kind:'reinit'});
		this.setState( (prevState) => {
			return {
				start: false ,
				publish: true ,
				reinit: true ,
				redirect: false
			};
		});
	}

	clickLogout(event) {
		event.preventDefault();
		logout()
			.then( response => {
				console.log(response);
				chrome.runtime.sendMessage({kind:'nowIsLogout'}),
				this.setState( (prevState) => {
					return {
						start: prevState.start ,
						publish: prevState.publish ,
						reinit: prevState.reinit ,
						redirect : true
					};
				});
			})
			.catch(err => {
				console.error(err);
			});
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/login"/>;
		}
		else {
			if (this.state.start) {
				return (
					<div>
						<Row>
							<Button onClick={this.clickPublish}>STOP AND PUBLISH</Button>
							<Button onClick={this.clickReinit}>STOP AND REINIT</Button>
						</Row>
						<Row>
							<Button onClick={this.clickLogout}>Logout</Button>
						</Row>
					</div>
				);
			}
			else {
				return (
					<div>
						<Row>
							<Button onClick={this.clickStart}>START RECORDING</Button>
						</Row>
						<Row>
							<Button onClick={this.clickLogout}>Logout</Button>
						</Row>
					</div>
				);
			}
		}
	}
}

