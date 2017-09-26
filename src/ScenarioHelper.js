import axios from 'axios';
import { config } from './pluginConfig.js';

const BASE_URL = config.baseUrl;

export function postScenario(scenario) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/api/scenario`;
		axios.post(url, scenario)
			.then( response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
