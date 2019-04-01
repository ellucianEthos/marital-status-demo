import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core';
import { withContext } from '../../Context';
import PropTypes from 'prop-types';

const styles = (theme) => ({
});

class ChangeNotificationsTable extends Component {

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

		const data = Object.keys(context.changeNotificationsCache);

		const headers = [
			'ID',
			'Time Published',
			'Operation',
			'Resource Name',
			'View',
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
								.map((changeNotificationId, idx) => {
									const changeNotification = context.changeNotificationsCache[changeNotificationId];

									return (
										<TableRow key={idx}>
											<TableCell>{changeNotification.id}</TableCell>
											<TableCell>{changeNotification.published}</TableCell>
											<TableCell>{changeNotification.operation}</TableCell>
											<TableCell>{changeNotification.resource.name}</TableCell>
											<TableCell padding="checkbox"><IconButton onClick={() => { this.props.onChangeNotificationClicked(changeNotification.id); }}><Icon>code</Icon></IconButton></TableCell>
										</TableRow>
									)
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

ChangeNotificationsTable.propTypes = {
	onChangeNotificationClicked: PropTypes.func.isRequired,
}

export default withContext(withStyles(styles)(ChangeNotificationsTable));
