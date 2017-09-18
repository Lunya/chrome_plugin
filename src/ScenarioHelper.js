import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export function postScenario(scenario) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/scenario`;
		axios.post(url, scenario)
			.then( response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
