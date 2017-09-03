const START_RECORDING_TEXT = 'Record New';
const STOP_RECORDING_TEXT = 'Stop Recording';

document.addEventListener('DOMContentLoaded', popupIsLoaded);

function popupIsLoaded() {
	chrome.runtime.sendMessage({kind:'status'}, function (response) {
		var popupManager = new PopupManager(response);
		popupManager.start();
		popupManager.render();
	});
}

class PopupManager {
	constructor(pageManager) {
		this.pageManager = pageManager;
		this.button = document.getElementById('callToAction'); 
		this.scenarioDIV = document.getElementById('scenario');
		this.saveLink = document.getElementById('save');
	}
    
	start() {
		this.button.addEventListener('click', actionPerformed.bind(this));
	}
    
	render() {
		chrome.runtime.sendMessage({kind:'status'}, response => {
			this.pageManager = response;
			if (this.pageManager.isRecording) {
				this.button.innerHTML = STOP_RECORDING_TEXT;
				this.scenarioDIV.innerHTML = this.pageManager.scenario;
				setScenarioJSONLink(this.pageManager.scenario);
			} else {
				this.button.innerHTML = START_RECORDING_TEXT;
				this.scenarioDIV.innerHTML = this.pageManager.scenario;
				this.saveLink.removeAttribute('href');
				this.saveLink.removeAttribute('download');
			}
		});
	}
}

function actionPerformed() {
	if (this.pageManager.isRecording) {
		chrome.runtime.sendMessage({kind:'stop'});
	} else {
		chrome.runtime.sendMessage({kind:'start'});
	}
	this.render();
}


function setScenarioJSONLink(scenario) {
	var link = document.getElementById('save');
	link.removeAttribute('href');
	link.removeAttribute('download');

	if (link.download !== undefined) { // feature detection
		// Browsers that support HTML5 download attribute
		var blob = new Blob([scenario], {
			type: 'application/json;charset=utf-8;'
		});
		var url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', 'scenario.json');
		//link.style = "visibility:hidden";
	}

	if (navigator.msSaveBlob) { // IE 10+
		link.addEventListener('click', function(event) {
			var blob = new Blob([inscription2CSV(inscriptions)], {
				'type': 'text/csv;charset=utf-8;'
			});
			navigator.msSaveBlob(blob, 'inscriptions.csv');
		}, false);
	}
}
