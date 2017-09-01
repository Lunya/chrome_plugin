class PageManager {
	constructor() {
		this.scenario = [];
		this.isRecording = false;
	}

	start() {
		chrome.runtime.onMessage.addListener(this.addActionToScenario.bind(this));
	}

	startRecording() {
		this.scenario = [];
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

	addActionToScenario(action) {
		this.scenario.push(action);
	}
}

function webNavigationCommitted({transitionType, url}) {
	chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
		if (transitionType === 'reload' || transitionType === 'start_page') {
			if (activeTabs.length && activeTabs.length > 0) {
				pageManager.scenario.push('Goto '+url);
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
