var xobj = new XMLHttpRequest();
xobj.overrideMimeType('application/json');
xobj.open('GET', 'config.json', false);
xobj.send(null);
export const config = JSON.parse(xobj.responseText);
