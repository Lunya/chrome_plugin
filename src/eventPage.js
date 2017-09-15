import * as watlib from 'wat_action_nightmare';

class PageManager {
	constructor() {
		this.scenario = new watlib.Scenario();
		this.isRecording = false;
		this.isLoggedIn = false;
	}

	start() {
		chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
	}

	startRecording() {
		console.log('startRecording');
		this.scenario = new watlib.Scenario();
		this.isRecording = true;
		chrome.webNavigation.onCommitted.addListener(webNavigationCommitted);
		chrome.webNavigation.onCompleted.addListener(webNavigationCompleted);
	
		chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
			if (activeTabs.length && activeTabs.length > 0) {
				console.log('reload');
				chrome.tabs.reload(activeTabs[0].id);
			}
		});
	}

	publishRecording() {
		this.isRecording = false;
		chrome.webNavigation.onCommitted.removeListener(webNavigationCommitted);
		chrome.webNavigation.onCompleted.removeListener(webNavigationCompleted);
		return   {
			actions : this.scenario.actions
		};
	}

	reinitRecording() {
		this.isRecording = false;
		chrome.webNavigation.onCommitted.removeListener(webNavigationCommitted);
		chrome.webNavigation.onCompleted.removeListener(webNavigationCompleted);
		this.scenario = new watlib.Scenario();
	}

	handleMessage(msg, sender, sendResponse) {
		switch (msg.kind) {
		case 'start': 
			this.startRecording();
			break;
		case 'publish': 
			sendResponse(this.publishRecording());
			break;
		case 'reinit': 
			this.reinitRecording();
			break;
		case 'nowIsLogin': 
			this.isLoggedIn = true;
			break;
		case 'nowIsLogout': 
			this.isLoggedIn = false;
			break;
		case 'getState': 
			sendResponse({
				isLoggedIn: this.isLoggedIn,
				isRecording: this.isRecording
			});
			break;
		case 'action' : 
			console.log('action added');
			this.scenario.addAction(watlib.ActionFactory.createAction(msg.action));
			break;
		}
	}
}

function webNavigationCommitted({transitionType, url}) {
	chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
		if (transitionType === 'reload' || transitionType === 'start_page') {
			if (activeTabs.length && activeTabs.length > 0) {
				pageManager.scenario.addAction(watlib.ActionFactory.createAction({type:'GotoAction', url:url}));
				console.log('goto added');
			}
		}
	});  
}

function webNavigationCompleted({frameId}) {
	chrome.tabs.query({active: true}, activeTabs => {
		if (frameId === 0) {
			if (activeTabs.length && activeTabs.length > 0) {
				chrome.tabs.executeScript(activeTabs[0].id , {file:'attachListener.js'});
			}
		}
	});
}

var pageManager = new PageManager();
pageManager.start();
