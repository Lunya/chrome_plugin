scenario = [];
isRecording = false;

chrome.runtime.onMessage.addListener(addActionToScenario);

function addActionToScenario(action) {
	scenario.push(action);
}
