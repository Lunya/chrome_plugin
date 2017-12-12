import { sha256 } from 'js-sha256';
import { login , postScenario } from './services.js';

class PageManager {
	constructor() {
		this.scenario = [];
		this.isRecording = false;
		this.isLoggedIn = false;
		this.windowId = 0;
		this.tabId = 0;
		this.jwt = sha256('');
		this.handleMessage = this.handleMessage.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.getRecordedScenarioAndStop = this.getRecordedScenarioAndStop.bind(this);
		this.reinitRecording = this.reinitRecording.bind(this);
		this.webNavigationCommitted = this.webNavigationCommitted.bind(this);
		this.webNavigationCompleted = this.webNavigationCompleted.bind(this);
		this.webNavigationCreatedNavigationTarget = this.webNavigationCreatedNavigationTarget.bind(this);


		chrome.webNavigation.onCommitted.addListener(this.webNavigationCommitted);
		chrome.webNavigation.onCompleted.addListener(this.webNavigationCompleted);
		chrome.webNavigation.onCreatedNavigationTarget.addListener(this.webNavigationCreatedNavigationTarget);
	}

	start() {
		chrome.runtime.onMessage.addListener(this.handleMessage);
	}

	handleMessage(msg, sender, sendResponse) {
		switch (msg.kind) {
		case 'login':
			login(msg.credential)
				.then(response => {
					console.log(JSON.stringify(response));
					if (response.logged === false) {
						this.isLoggedIn = false;
					} else {
						this.isLoggedIn = true;
						this.jwt = response.jwt;
					}
					let responseToMsg = {isLoggedIn : this.isLoggedIn};
					console.log(JSON.stringify(responseToMsg));
					sendResponse(responseToMsg);
				})
				.catch((ex) => {
					//console.log(ex);
					sendResponse(false);
				});
			return true;
		case 'logout':
			this.isLoggedIn = false;
			this.jwt = sha256('');
			break;
		case 'start':
			this.startRecording();
			break;
		case 'publish':
			var recordedScenario = this.getRecordedScenarioAndStop();
			postScenario(recordedScenario, this.jwt)
				.then( response => {
					sendResponse(response);
				})
				.catch( ex => {
					sendResponse(ex);
				});
			return true;
		case 'reinit':
			this.reinitRecording();
			break;
		case 'getState':
			sendResponse({
				isLoggedIn: this.isLoggedIn,
				isRecording: this.isRecording
			});
			break;
		case 'action' :
			console.log(`action added : ${msg.action.type}`);
			this.scenario.push(msg.action);
			break;
		}
	}

	startRecording() {
		console.log('startRecording');
		this.scenario = [];
		this.isRecording = true;

		chrome.windows.getCurrent({populate:true}, window => {
			this.window = window;
			this.tab = window.tabs.find( tab => {return tab.active;});
			console.log(`window:${this.window.id}, tab:${this.tab.id}`);
			console.log('reload');
			chrome.tabs.reload(this.tab.id);
		});
	}

	getRecordedScenarioAndStop() {
		this.isRecording = false;
		return   {
			actions : this.scenario,
			wait : 1000
		};
	}

	reinitRecording() {
		this.isRecording = false;
		this.scenario = [];
	}

	webNavigationCommitted({transitionType, url}) {
		console.log('webNavigationCommitted');
		if (transitionType === 'reload' || transitionType === 'start_page') {
			pageManager.scenario.push({type:'GotoAction', url:url});
			console.log('goto added');
		}
	}

	webNavigationCompleted({tabId, frameId}) {
		console.log(`webNavigationCompleted: tabId=${tabId}, frameId=${frameId}`);
		console.log(`window:${this.window.id}, tab:${this.tab.id}`);
		if (tabId === this.tab.id) {
			if (frameId === 0) {
				console.log('executeScript');
				chrome.tabs.executeScript(this.tab.id, {file:'listener.bundle.js'});
				chrome.tabs.executeScript(this.tab.id, {file:'favicon.js'});
			}
		}
	}

	webNavigationCreatedNavigationTarget({sourceTabId, tabId}) {
		console.log(`createdNavigationTarget from ${sourceTabId} to ${tabId}`);
	}

}

var pageManager = new PageManager();
pageManager.start();
