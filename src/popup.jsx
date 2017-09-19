import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, browserHistory} from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Record from './Record.jsx';

import { Grid, Row, PageHeader} from 'react-bootstrap';
//import { LinkContainer } from 'react-router-bootstrap';

class PopupPlugin extends React.Component {

	render() {	
		return (
			<Router history={browserHistory}>
				<Grid>	
					<PageHeader> WAT <small> Web Automatic Tester</small></PageHeader>		
					<Row>
						Record your E2E Test Scenario.
						More information and account creation <a href="http://ec2-34-210-184-241.us-west-2.compute.amazonaws.com:8080/">here</a>
					</Row>
					<Row><p/>
					</Row>
					<Route exact path="/popup.html" component={Home}/>
					<Route path="/login" component={Login}/>
					<Route path="/logout" component={Logout}/>
					<Route path="/record" component={Record}/>
				</Grid>
			</Router>);
		
	}
}

render(<PopupPlugin/>, document.getElementById('app'));

