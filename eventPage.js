class PageManager {
	constructor() {
		this.scenario = [];
		this.isRecording = false;
	}

	start() {
		chrome.runtime.onMessage.addListener(this.addActionToScenario.bind(this));
	}

	startRecording() {
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
		this.scenario = [];
		chrome.webNavigation.onCommitted.removeListener(webNavigationCommitted);
		chrome.webNavigation.onCompleted.removeListener(webNavigationCompleted);
	}

	addActionToScenario(action) {
		alert('receive msg:'+action);
		this.scenario.push(action);
	}
}

function webNavigationCommitted({transitionType, url}) {
	chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
		if (transitionType === 'reload' || transitionType === 'start_page') {
			if (activeTabs.length && activeTabs.length > 0) {
				//console.log('send msg goto');
				//chrome.runtime.sendMessage('Goto' + url);
				pageManager.scenario.push('Goto '+url);
				alert('send msg goto');
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
