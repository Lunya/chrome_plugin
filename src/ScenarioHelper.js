import axios from 'axios';

//const BASE_URL = 'http://localhost';
//const BASE_URL = 'http://18.194.148.175';
const BASE_URL = 'http://37.59.110.250';

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
