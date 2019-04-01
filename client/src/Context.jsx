/**
 * The Context class acts as a "store", and holds all information and functions
 * that are called by various Components within the project.
 */

import React from 'react';
import axios from 'axios';
import { withContext as wc } from 'with-context';

const Context = React.createContext();

class Provider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			personsCache: {},
			changeNotificationsCache: {},
			maritalStatusCache: {},
			apiError: false,
		}

		this.loadPersons = this.loadPersons.bind(this);
		this.updatePersonInCache = this.updatePersonInCache.bind(this);
		this.editPerson = this.editPerson.bind(this);
		this.startChangeNotificationPoll = this.startChangeNotificationPoll.bind(this);
		this.getChangeNotifications = this.getChangeNotifications.bind(this);
	}


	/**
	 * Called when the application loads. This starts all necessary calls to load data into the application,
	 * as well as starting the interval for consuming change notifications every 30 seconds
	 *
	 * @memberof Provider
	 */
	async componentDidMount() {
		try {
			this.startChangeNotificationPoll();
			await this.loadMaritalStatuses();
			await this.loadPersons();
		} catch (e) {
			// Since the server methods above automatically call Ethos Integration's /auth endpoint, it's possible
			// to get back a "406 Not Acceptable", which means that your API Key is invalid
			if (e.response && e.response.status === 406) {
				this.setState({
					apiError: true,
					apiErrorMessage: '406 Received - Invalid API Key'
				});
				return;
			}

			console.log("Unexpected error hitting Ethos Integration:")
			console.log(e.response);
			this.setState({
				apiError: true,
				apiErrorMessage: 'Unexpected error calling Ethos Integration. Check server logs'
			});
		}
	}

	/**
	 * Starts a 30 second interval that will query for change notifications from Ethos Integration
	 *
	 * @memberof Provider
	 */
	startChangeNotificationPoll() {
		setInterval(async () => {
			await this.getChangeNotifications();
		}, 1000 * 30); // 30 second interval
	}

	/**
	 * Loads a list of Marital Statuses from the server into a cache in the client
	 *
	 * @memberof Provider
	 */
	async loadMaritalStatuses() {
		const response = await axios({
			url: `/api/marital-statuses`,
		});

		const maritalStatusCache = this.state.maritalStatusCache;
		for (const maritalStatus of response.data) {
			maritalStatusCache[maritalStatus.id] = maritalStatus;
		}

		this.setState({
			maritalStatusCache: maritalStatusCache,
		});
	}

	/**
	 * Loads persons into a cache in the client. Takes an offset, which starts as 0.
	 * This function calls itself recursively until there is no more data to load
	 *
	 * @param {number} [offset=0] The offset to call the server with
	 * @memberof Provider
	 */
	async loadPersons(offset = 0) {
		const response = await axios({
			url: `/api/persons?limit=${500}&offset=${offset}`,
		});

		// Generate a new cache based on the existing one
		const personsCache = this.state.personsCache;
		for (const person of response.data) {
			personsCache[person.id] = person;
		}

		// Set the cache for the application to view
		this.setState({
			personsCache: personsCache,
		});

		// Start the next page of data
		const returnedTotal = parseInt(response.headers['x-total-count']);
		const returnedPageSize = parseInt(response.headers['x-max-page-size']);
		if ((offset + returnedPageSize) < returnedTotal) {
			await this.loadPersons(offset + returnedPageSize);
		}
	}

	/**
	 * Updates a specific person in the client's cache by ID.
	 *
	 * @param {*} person The person object
	 * @memberof Provider
	 */
	updatePersonInCache(person) {
		const { personsCache } = this.state;

		personsCache[person.id] = person;

		this.setState({
			personsCache: personsCache,
		});
	}


	/**
	 * Makes a GET to Ethos Integration to get a person by ID.
	 * Automatically updates their record in the client's cache.
	 *
	 * @param {*} id The id of the person
	 * @memberof Provider
	 */
	async getPerson(id) {
		const response = await axios({
			url: `/api/persons${id}`,
		});

		this.updatePersonInCache(response.data);
	}


	/**
	 * Edits a person by making a PUT call to Ethos Integration.
	 * Automatically updates the client's cache representation with the response.
	 *
	 * @param {*} person The person object to update
	 * @memberof Provider
	 */
	async editPerson(person) {
		const response = await axios({
			method: 'PUT',
			url: `/api/persons/${person.id}`,
			data: person,
		});

		this.updatePersonInCache(response.data)
	}


	/**
	 * Makes a GET call to Ethos Integration to consume the most recent change notifications
	 * Automatically updates the client's cache of change notifications.
	 *
	 * @memberof Provider
	 */
	async getChangeNotifications() {
		const response = await axios({
			method: 'GET',
			url: `/api/consume`,
		});

		const changeNotificationsCache = this.state.changeNotificationsCache;
		for (let changeNotification of response.data) {
			changeNotificationsCache[changeNotification.id] = changeNotification;
		}

		this.setState({
			changeNotificationsCache: changeNotificationsCache,
		});
	}


	/**
	 * Gets select pieces of information for a person.
	 *
	 * @param {*} id The ID of the person to get information for
	 * @returns An object with `firstName`, `lastName`, `fullName`, `email`, `maritalStatusId`, and `maritalStatusTitle`
	 * @memberof Provider
	 */
	getPersonDisplayInformation(id) {
		const person = this.personsCache[id];
		if (!person) return {};

		let firstName;
		let lastName;
		let fullName;
		if (person.names && person.names.length > 0) {
			const preferredName = person.names.find(name => name.preference && name.preference.toLowerCase() === "preferred");
			if (preferredName) {
				firstName = preferredName.firstName;
				lastName = preferredName.lastName;
				fullName = preferredName.fullName;
			} else {
				firstName = person.names[0].firstName;
				lastName = person.names[0].lastName;
				fullName = person.names[0].fullName;
			}
		}

		let email;
		if (person.emails && person.emails.length > 0) {
			const preferredEmail = person.emails.find(email => email.preference && email.preference.toLowerCase() === "preferred");
			if (preferredEmail) {
				email = preferredEmail.address;
			} else {
				email = person.emails[0].address;
			}
		}

		let maritalStatusId;
		let maritalStatusTitle;
		if (person.maritalStatus && person.maritalStatus.detail && person.maritalStatus.detail.id) {
			maritalStatusId = this.maritalStatusCache[person.maritalStatus.detail.id].id;
			maritalStatusTitle = this.maritalStatusCache[person.maritalStatus.detail.id].title;
		}

		return {
			firstName,
			lastName,
			fullName,
			email,
			maritalStatusId,
			maritalStatusTitle,
		};
	}

	render() {
		return (
			<Context.Provider value={{
				editPerson: this.editPerson,
				getChangeNotifications: this.getChangeNotifications,
				getPersonDisplayInformation: this.getPersonDisplayInformation,
				...this.state,
			}}>
				{this.props.children}
			</Context.Provider>
		)
	}
}

const Consumer = Context.Consumer;
const withContext = wc(Context, "context");

export {
	Provider,
	Consumer,
	withContext,
}