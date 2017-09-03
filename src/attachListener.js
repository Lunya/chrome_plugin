
function attach() {
	const inputs = document.querySelectorAll('input, textarea');
	for (let i = 0; i < inputs.length; i++) {
		//inputs[i].addEventListener('change', handleEvent);
	}
	document.body.addEventListener('click', handleEvent);
}

function handleEvent (e) {
	chrome.runtime.sendMessage({kind:'action', action: {type:'ClickAction', selector: computeSelector(e.target)} });
}


function computeSelector(el) {
	var names = [];
	while (el.parentNode) {
		if (el == el.ownerDocument.documentElement)
			names.unshift(el.tagName);
		else {
			for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
			names.unshift(`${el.tagName}:nth-child(${c})`);
		}
		el = el.parentNode;
	}
	return names.join(' > ');
}

attach();