import { select } from 'optimal-select';

function attach() {
	console.log('attach');
	const inputs = document.querySelectorAll('input, textarea');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('input', handleInput);
	}

	const observer = new MutationObserver(handleMutation);
	const config = {
		childList: true,
		subtree: true
	};

	const all = document.querySelectorAll('body *');
	for (let i = 0; i < all.length; i++) {
		console.log('mutation observe node');
		observer.observe(all[i], config);
	}

	document.body.addEventListener('click', handleClick);
}

function handleMutation(mutations) {
	console.log('handleMutation');
	mutations.forEach(mutationRecord => {
		console.log(mutationRecord.type);
		if (mutationRecord.type === 'childList') {
			var addedNodes = mutationRecord.addedNodes;
			for (var index = 0; index < addedNodes.length; index++) {
				var addedNode = addedNodes[index];
				console.log(addedNode.nodeName);
				if (addedNode.tagName) {
					const inputs = addedNode.querySelectorAll('input, textarea');
					for (let i = 0; i < inputs.length; i++) {
						console.log('add handleInput');
						inputs[i].addEventListener('input', handleInput);
					}
				}
			}
		}
	});


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
	return {
		watId: computeSelectorWithID(el),
		watPath: computeSelectorWithPath(el),
		optimal: computeSelectorOptimal(el)
	};
}

function computeSelectorWithID(el) {
	var names = [];
	while (el.parentNode) {
		if (el.id) {
			names.unshift(`#${el.id}`);
			break;
		} else {
			if (el == el.ownerDocument.documentElement)
				names.unshift(el.tagName);
			else {
				for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
				names.unshift(`${el.tagName}:nth-child(${c})`);
			}
			el = el.parentNode;
		}
	}
	return names.join(' > ');
}

function computeSelectorWithPath(el) {
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

function computeSelectorOptimal(el) {
	var selector = select(el);
	console.log(selector);
	return selector;
}

attach();
