import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withContext } from '../../Context';
import PersonsTable from './PersonsTable';
import PersonsEditDialog from './PersonsEditDialog';

const styles = (theme) => ({
});

class PersonsTab extends Component {

	constructor(props) {
		super(props);

		this.state = {
			personEditDialogOpen: false,
			personIdToEdit: null,
		};

		this.showPersonEditDialog = this.showPersonEditDialog.bind(this);
		this.closePersonEditDialog = this.closePersonEditDialog.bind(this);
	}

	showPersonEditDialog(id) {
		this.setState({
			personEditDialogOpen: true,
			personIdToEdit: id,
		});
	}

	closePersonEditDialog() {
		this.setState({
			personEditDialogOpen: false,
			personIdToEdit: null,
		});
	}

	render() {
		return (
			<React.Fragment>
				<PersonsTable
					onPersonClicked={this.showPersonEditDialog}
				/>

				<PersonsEditDialog
					open={this.state.personEditDialogOpen}
					onExited={this.closePersonEditDialog}
					onSaved={this.closePersonEditDialog}
					personId={this.state.personIdToEdit}
				/>
			</React.Fragment>
		);
	}
}

export default withContext(withStyles(styles)(PersonsTab));
