import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, IconButton, Icon, Typography } from '@material-ui/core';
import { withContext } from '../../Context';
import PropTypes from 'prop-types';

const TableCellWrapper = (props) => {
	if (props.children) {
		return <TableCell><Typography>{props.children}</Typography></TableCell>
	} else {
		return <TableCell><Typography color="textSecondary" component="em">None</Typography></TableCell>
	}
}

const styles = (theme) => ({
});

class PersonsTable extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			rowsPerPage: 5,
		};

		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	render() {
		const {
			context,
		} = this.props;

		// Get an array of all the persons we have cached, since the table needs an array
		const data = Object.keys(context.personsCache);

		const headers = [
			'First Name',
			'Last Name',
			'Marital Status',
			'Edit',
		];

		return (
			<React.Fragment>
				<Table>
					<TableHead>
						<TableRow>
							{
								headers.map((header, idx) => (
									<TableCell key={idx}>{header}</TableCell>
								))
							}
						</TableRow>
					</TableHead>
					<TableBody>
						{
							data
								.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
								.map((personId, idx) => {
									const personInformation = context.getPersonDisplayInformation(personId);

									return (
										<TableRow key={idx}>
											<TableCellWrapper>{personInformation.firstName}</TableCellWrapper>
											<TableCellWrapper>{personInformation.lastName}</TableCellWrapper>
											<TableCellWrapper>{personInformation.maritalStatusTitle}</TableCellWrapper>
											<TableCell padding="checkbox"><IconButton onClick={() => { this.props.onPersonClicked(personId); }}><Icon>edit_outlined</Icon></IconButton></TableCell>
										</TableRow>
									);
								})
						}
					</TableBody>
				</Table>

				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={data.length}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.page}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</React.Fragment>
		);
	}
}

PersonsTable.propTypes = {
	onPersonClicked: PropTypes.func.isRequired,
}

export default withContext(withStyles(styles)(PersonsTable));
