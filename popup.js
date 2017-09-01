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
		if (this.pageManager.isRecording) {
			this.button.innerHTML = STOP_RECORDING_TEXT;
			this.scenarioDIV.innerHTML = this.pageManager.scenario;
		} else {
			this.button.innerHTML = START_RECORDING_TEXT;
			this.scenarioDIV.innerHTML = this.pageManager.scenario;
		}
	}
}

function actionPerformed() {
	if (this.pageManager.isRecording) {
		this.pageManager.stopRecording();
	} else {
		this.pageManager.startRecording();
	}
	this.render();
}



function popupIsLoaded() {
	chrome.runtime.getBackgroundPage(function (bg) {
		var popupManager = new PopupManager(bg.pageManager);
		popupManager.start();
		popupManager.render();
	});
}

document.addEventListener('DOMContentLoaded', popupIsLoaded);
