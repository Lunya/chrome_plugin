import { select } from './optimal-select.js';
import CssSelectorGenerator from 'css-selector-generator';

function attach() {
	console.log('attach');
	const inputs = document.querySelectorAll('input, textarea');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('input', handleInput, true);
	}

	const observer = new MutationObserver(handleMutation);
	const config = {
		childList: true,
		subtree: true
	};

	const all = document.querySelectorAll('body *');
	for (let i = 0; i < all.length; i++) {
		observer.observe(all[i], config);
	}

	const selects = document.querySelectorAll('select');
	for (let i = 0; i < selects.length; i++) {
		selects[i].addEventListener('change', handleChange,true); 
	}

	document.body.addEventListener('click', handleClick,true);
}

function handleMutation(mutations) {
	mutations.forEach(mutationRecord => {
		if (mutationRecord.type === 'childList') {
			let addedNodes = mutationRecord.addedNodes;
			for (let index = 0; index < addedNodes.length; index++) {
				let addedNode = addedNodes[index];
				if (addedNode.tagName) {
					const inputs = addedNode.querySelectorAll('input, textarea');
					for (let i = 0; i < inputs.length; i++) {
						inputs[i].addEventListener('input', handleInput);
					}
				}
			}
		}
	});
}

function handleClick (e) {
	if (e.target.tagName.toLowerCase() !== 'input' ) {
		chrome.runtime.sendMessage({kind:'action', action: {type:'ClickAction', selector: computeSelector(e.target)} });
	}
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

function handleChange(e) {
	chrome.runtime.sendMessage({
		kind:'action',
		action: {
			type:'SelectAction',
			selector: computeSelector(e.target),
			option: e.target.value
		}
	});
}

function computeSelector(el) {
	return {
		watId: computeSelectorWithID(el),
		watPath: computeSelectorWithPath(el),
		optimal: computeSelectorOptimal(el),
		css: computeCSSSelectorGenerator(el)
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
	return select(el, {
		root: document,
		priority: ['id','class','href','src'],
		ignore: {
			class(className) {
				console.log(`className:${JSON.stringify(className)}`);
				return (className==='class') || (className.indexOf('ng-') !== -1);
			},
			attribute (name, value, defaultPredicate) {
				// exclude HTML5 data attributes
				console.log(`name:${JSON.stringify(name)}, value:${JSON.stringify(value)}, defaultPredicate:${JSON.stringify(defaultPredicate)}`);
				return false;
				//return (/data-*/).test(name) || defaultPredicate(name, value);
			}
		}
	});
}

function computeCSSSelectorGenerator(el) {
	let custom_options = {selectors: ['tag', 'id', 'class', 'attribute']};
	let cssSelectorGenerator = new CssSelectorGenerator(custom_options);
	return cssSelectorGenerator.getSelector(el);
}

attach();
