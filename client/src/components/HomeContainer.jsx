import React, { Component } from 'react';
import { withStyles, Tab, Tabs, AppBar, Toolbar, Typography, Card, CardContent, Snackbar } from '@material-ui/core';
import { withContext } from '../Context';
import PersonsTab from './PersonsTab/PersonsTab';
import ChangeNotificationsTab from './ChangeNotificationsTab/ChangeNotificationsTab';

const styles = (theme) => ({
	mainPadding: {
		marginLeft: theme.spacing.unit * 12,
		marginRight: theme.spacing.unit * 12,
		marginTop: theme.spacing.unit * 8,
	},
	tabPadding: {
		padding: theme.spacing.unit * 3,
	},
});

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 0,
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event, value) {
		this.setState({
			value,
		});
	}

	render() {
		const {
			classes,
			context,
		} = this.props;

		return (
			<React.Fragment>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={context.apiError}
					message={<span id="message-id">{context.apiErrorMessage}</span>}
					classes={{ root: classes.snackRoot }}
					autoHideDuration={2000}
				/>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" color="inherit">
							eLive 2019 - Demo
						</Typography>
					</Toolbar>
				</AppBar>
				<Card className={classes.mainPadding}>
					<CardContent>
						<Tabs value={this.state.value} onChange={this.handleChange}>
							<Tab label={<Typography>View Persons</Typography>} />
							<Tab label={<Typography>View Change Notifications</Typography>} />
						</Tabs>
						<div className={classes.tabPadding}>
							{this.state.value === 0 && <PersonsTab />}
							{this.state.value === 1 && <ChangeNotificationsTab />}
						</div>
					</CardContent>
				</Card>
			</React.Fragment>
		);
	}
}

export default withContext(withStyles(styles)(Home));
