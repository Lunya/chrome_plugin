import * as watlib from 'wat-action';

class PageManager {
	constructor() {
		this.scenario = new watlib.Scenario();
		this.isRecording = false;
	}

	start() {
		chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
	}

	startRecording() {
		this.scenario = new watlib.Scenario();
		this.isRecording = true;
		chrome.webNavigation.onCommitted.addListener(webNavigationCommitted);
		chrome.webNavigation.onCompleted.addListener(webNavigationCompleted);
	
		chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
			if (activeTabs.length && activeTabs.length > 0) {
				chrome.tabs.reload(activeTabs[0].id);
			}
		});
	}

	stopRecording() {
		this.isRecording = false;
		chrome.webNavigation.onCommitted.removeListener(webNavigationCommitted);
		chrome.webNavigation.onCompleted.removeListener(webNavigationCompleted);
	}

	handleMessage(msg, sender, sendResponse) {
		switch (msg.kind) {
		case 'start': 
			this.startRecording();
			break;
		case 'stop': 
			this.stopRecording();
			break;
		case 'status': 
			sendResponse({scenario : this.scenario.toString(), isRecording: this.isRecording});
			break;
		case 'action' : 
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
			}
		}
	});  
}

function webNavigationCompleted() {
	chrome.tabs.query({active: true}, activeTabs => {
		if (activeTabs.length && activeTabs.length > 0) {
			chrome.tabs.executeScript(activeTabs[0].id , {file:'attachListener.js'});
		}
	});
}

var pageManager = new PageManager();
pageManager.start();
