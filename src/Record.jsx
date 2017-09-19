import React from 'react';
import {postScenario} from './ScenarioHelper.js';

import { Redirect } from 'react-router-dom';
import { Row, Button } from 'react-bootstrap';

export default class Record extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			start: false,
			publish: true,
			reinit: true
		};
		this.clickStart = this.clickStart.bind(this);
		this.clickPublish = this.clickPublish.bind(this);
		this.clickReinit = this.clickReinit.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			this.setState( () => {
				return {
					start: response.isRecording ,
					publish: !response.isRecording ,
					reinit: !response.isRecording 
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
				reinit: false 
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
							reinit: true 
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
				reinit: true 
			};
		});
	}

	render() {
		if (this.state.start) {
			return (
				<Row>
					<Button onClick={this.clickPublish} disabled={this.state.publish}>STOP AND PUBLISH</Button>
					<Button onClick={this.clickReinit} disabled={this.state.reinit}>STOP AND REINIT</Button>
				</Row>
			);
		}
		else {
			return (
				<Row>
					<Button onClick={this.clickStart} disabled={this.state.start}>START RECORDING</Button>
				</Row>
			);
		}
	}
}

