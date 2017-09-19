import axios from 'axios';

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://ec2-34-210-184-241.us-west-2.compute.amazonaws.com:8080';

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
