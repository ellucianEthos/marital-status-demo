import React, { Component } from 'react';
import { withContext } from '../../Context';
import { withStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = (theme) => ({
	selectLabel: {
		minWidth: "200px",
	},
	select: {
		marginTop: theme.spacing.unit * 2,
		width: '100%',
	}
});

class PersonsEditDialog extends Component {

	constructor(props) {
		super(props);

		this.state = {
			maritalStatusId: '',
		};

		this.save = this.save.bind(this);
		this.setPersonInformation = this.setPersonInformation.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			maritalStatusId: e.target.value,
		});
	}

	save() {
		const personToEdit = JSON.parse(JSON.stringify(this.props.context.personsCache[this.props.personId]));

		if (this.state.maritalStatusId === "none") {
			delete personToEdit.maritalStatus;
		} else {
			personToEdit.maritalStatus = {
				detail: { id: this.state.maritalStatusId },
				maritalCategory: this.props.context.maritalStatusCache[this.state.maritalStatusId].maritalCategory,
			}
		}

		this.props.context.editPerson(personToEdit);
		this.props.onSaved();
	}

	setPersonInformation() {
		const personInformation = this.props.context.getPersonDisplayInformation(this.props.personId);

		this.setState({
			maritalStatusId: personInformation.maritalStatusId || "none",
		});
	}

	render() {
		const {
			onExited,
			personId,
			context,
			classes,
		} = this.props;

		if (!personId) return null;

		const personInformation = this.props.context.getPersonDisplayInformation(this.props.personId);

		return (
			<Dialog
				open={this.props.open}
				onExited={this.onExited}
				onEntering={this.setPersonInformation}
				fullWidth
			>
				<DialogTitle>
					Edit {personInformation.fullName}
				</DialogTitle>
				<DialogContent>
					<div>
						<TextField
							label="First Name"
							value={personInformation.firstName}
							margin="normal"
							disabled
							fullWidth
						/>
					</div>
					<div>
						<TextField
							label="Last Name"
							value={personInformation.lastName}
							margin="normal"
							disabled
							fullWidth
						/>
					</div>
					<div>
						<TextField
							label="Email"
							value={personInformation.email}
							margin="normal"
							disabled
							fullWidth
						/>
					</div>
					<FormControl className={classes.select}>
						<InputLabel className={classes.selectLabel}>Marital Status</InputLabel>
						<Select
							value={this.state.maritalStatusId}
							onChange={this.handleChange}
							autoWidth
						>
							<MenuItem value="none">None</MenuItem>
							{
								Object.keys(context.maritalStatusCache).map(maritalStatusCacheId => (
									<MenuItem key={maritalStatusCacheId} value={maritalStatusCacheId}>{context.maritalStatusCache[maritalStatusCacheId].title}</MenuItem>
								))
							}
						</Select>
						{/* <FormHelperText>Some important helper text</FormHelperText> */}
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={onExited} variant="contained" color="secondary">Close</Button>
					<Button onClick={this.save} variant="contained">Save</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

PersonsEditDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onExited: PropTypes.func.isRequired,
	onSaved: PropTypes.func.isRequired,
	personId: PropTypes.string,
}

export default withContext(withStyles(styles)(PersonsEditDialog));
