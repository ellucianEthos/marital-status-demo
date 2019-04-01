import React, { Component } from 'react';
import { withContext } from '../../Context';
import { withStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = (theme) => ({
});

class ChangeNotificationViewDialog extends Component {

	render() {
		const {
			context
		} = this.props;

		if (!this.props.changeNotificationId) return null;

		const changeNotification = context.changeNotificationsCache[this.props.changeNotificationId]

		return (
			<Dialog
				open={this.props.open}
				fullWidth
			>
				<DialogTitle>
					Viewing Change Notification #{changeNotification.id}
				</DialogTitle>
				<DialogContent>
					<Typography variant="body1" component="pre">
						{JSON.stringify(changeNotification, null, '\t')}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.onClose} variant="contained" color="secondary">Close</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

ChangeNotificationViewDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	changeNotificationId: PropTypes.string,
}

export default withContext(withStyles(styles)(ChangeNotificationViewDialog));
