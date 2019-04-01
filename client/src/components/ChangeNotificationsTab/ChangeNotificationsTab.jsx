import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withContext } from '../../Context';
import ChangeNotificationsTable from './ChangeNotificationsTable';
import ChangeNotificationViewDialog from './ChangeNotificationViewDialog';

const styles = (theme) => ({
});

class ChangeNotificationsTab extends Component {

	constructor(props) {
		super(props);

		this.state = {
			changeNotificationViewDialogOpen: false,
			changeNotificationIdToView: '',
		};

		this.showChangeNotificationViewDialog = this.showChangeNotificationViewDialog.bind(this);
		this.closeChangeNotificationViewDialog = this.closeChangeNotificationViewDialog.bind(this);
	}

	componentDidMount() {
		this.props.context.getChangeNotifications();
	}

	showChangeNotificationViewDialog(id) {
		this.setState({
			changeNotificationViewDialogOpen: true,
			changeNotificationIdToView: id,
		});
	}

	closeChangeNotificationViewDialog() {
		this.setState({
			changeNotificationViewDialogOpen: false,
			changeNotificationIdToView: '',
		});
	}

	render() {
		return (
			<React.Fragment>
				<ChangeNotificationsTable
					onChangeNotificationClicked={(id) => { this.showChangeNotificationViewDialog(id); }}
				/>

				<ChangeNotificationViewDialog
					open={this.state.changeNotificationViewDialogOpen}
					onClose={this.closeChangeNotificationViewDialog}
					changeNotificationId={this.state.changeNotificationIdToView}
				/>
			</React.Fragment>
		);
	}
}

export default withContext(withStyles(styles)(ChangeNotificationsTab));
