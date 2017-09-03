const START_RECORDING_TEXT = 'Record New';
const STOP_RECORDING_TEXT = 'Stop Recording';

class PopupManager {
	constructor(pageManager) {
		this.pageManager = pageManager;
		this.button = document.getElementById('callToAction'); 
		this.scenarioDIV = document.getElementById('scenario');
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
			} else {
				this.button.innerHTML = START_RECORDING_TEXT;
				this.scenarioDIV.innerHTML = this.pageManager.scenario;
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



function popupIsLoaded() {
	chrome.runtime.sendMessage({kind:'status'}, function (response) {
		var popupManager = new PopupManager(response);
		popupManager.start();
		popupManager.render();
	});
}

document.addEventListener('DOMContentLoaded', popupIsLoaded);
