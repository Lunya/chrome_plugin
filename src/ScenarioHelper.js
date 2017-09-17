import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export function addWaitToScenarioAndSave(scenario, time) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/scenario/update_timeout`;
		axios.post(url, {
			scenario,
			time
		})
			.then( response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
