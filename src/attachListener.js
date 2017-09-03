
function attach() {
	const inputs = document.querySelectorAll('input, textarea');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('change', handleEvent);
	}
	document.body.addEventListener('click', handleEvent);
}

function handleEvent (e) {
	chrome.runtime.sendMessage({kind:'action', action:e.type + ' ' + e.target});
}

attach();