import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Record from './Record.jsx';

class PopupPlugin extends React.Component {

	render() {
		return (
			<Router history={browserHistory}>
				<Grid fluid={true}>
					<Row>
						<Col lg={12}>
							<Jumbotron><h1>Web Automatic Tester</h1>
							Record your end to end test scenario.
							</Jumbotron>
						</Col>
					</Row><Row><Col lg={12}>
						<Route exact path="/popup.html" component={Home}/>
						<Route path="/login" component={Login}/>
						<Route path="/logout" component={Logout}/>
						<Route path="/record" component={Record}/>
					</Col></Row>
				</Grid>
			</Router>);
	}
}

render(<PopupPlugin/>, document.getElementById('app'));
