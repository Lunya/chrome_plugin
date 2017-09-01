const START_RECORDING_TEXT = 'Record New';
const STOP_RECORDING_TEXT = 'Stop Recording';


function firstRender() {
	var button = document.getElementById('callToAction');
	button.innerHTML = START_RECORDING_TEXT;
	
	button.addEventListener('click', actionPerformed);
}

function actionPerformed() {
	var button = document.getElementById('callToAction');
	var scenarioDIV = document.getElementById('scenario');
    
	chrome.runtime.getBackgroundPage( bgPage => {
		if (bgPage.isRecording) {
			bgPage.isRecording = false;
			button.innerHTML = START_RECORDING_TEXT;
			scenarioDIV.innerHTML = bgPage.scenario;
			stopRecording();
		} else {
			bgPage.isRecording = true;
			button.innerHTML = STOP_RECORDING_TEXT;
			scenarioDIV.innerHTML = bgPage.scenario;
			startRecording();
		}
	});
	
}

function startRecording() {
	chrome.webNavigation.onCommitted.addListener(webNavigationCommitted);
	chrome.webNavigation.onCompleted.addListener(webNavigationCompleted);

	chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
		if (activeTabs.length && activeTabs.length > 0) {
			chrome.tabs.reload(activeTabs[0].id);
		}
	});
}

function stopRecording() {
	chrome.webNavigation.onCommitted.removeListener(webNavigationCommitted);
	chrome.webNavigation.onCompleted.removeListener(webNavigationCompleted);
	scenario = [];
}

function webNavigationCompleted() {
	chrome.tabs.query({active: true}, activeTabs => {
		if (activeTabs.length && activeTabs.length > 0) {
			chrome.tabs.executeScript(activeTabs[0].id , {file:'attachListener.js'});
		}
	});
}

function webNavigationCommitted({transitionType, url}) {
	chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
		if (transitionType === 'reload' || transitionType === 'start_page') {
			if (activeTabs.length && activeTabs.length > 0) {
				addActionToScenario('Goto ' + url );
			}
		}
	});  
}




document.addEventListener('DOMContentLoaded', firstRender);
