import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, browserHistory, Link} from 'react-router-dom';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Record from './Record.jsx';

class PopupPlugin extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<div>
					<ul>
						<li><Link to="/login">Login</Link></li>
						<li><Link to="/logout">Logout</Link></li>
						<li><Link to="/record">Record</Link></li>
					</ul>
					<Route path="/login" component={Login}/>
					<Route path="/logout" component={Logout}/>
					<Route path="/record" component={Record}/>
				</div>
			</Router>
		);
	}
}

render(<PopupPlugin/>, document.getElementById('app'));

