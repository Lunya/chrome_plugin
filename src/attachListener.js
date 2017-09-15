
function attach() {
	const inputs = document.querySelectorAll('input, textarea');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('input', handleInput);
	}
	document.body.addEventListener('click', handleClick);
}

function handleClick (e) {
	chrome.runtime.sendMessage({kind:'action', action: {type:'ClickAction', selector: computeSelector(e.target)} });
}

function handleInput(e) {
	chrome.runtime.sendMessage({
		kind:'action',
		action: {
			type:'TypeAction',
			selector: computeSelector(e.target),
			text: e.target.value
		}
	});
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
