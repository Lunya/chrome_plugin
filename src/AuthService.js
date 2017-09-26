import axios from 'axios';
import { config } from './pluginConfig.js';

const BASE_URL = config.baseUrl;

export function login(credentials) {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/api/login`;
		axios.post(url, credentials  )
			.then( response => {
				if (response.status === 401) {
					console.log('incorrect');
					resolve(false);
				} else {
					console.log('correct');
					resolve(true);
				}
			})
			.catch(() => {
				console.log('incorrect');
				reject(false);
			});
	});
}

export function logout() {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/api/logout`;
		axios.get(url)
			.then(response => {
				resolve(response);
			})
			.catch(err => {
				reject(err);
			});
	});
}
