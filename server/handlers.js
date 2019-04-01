const axios = require('axios').create({ // Library for making HTTP requests
	headers: {
		'Accept': '*/*', // Certain backend systems are picky about what Accept header is sent
	},
});
axios.interceptors.request.use(request => { // Log all HTTP requests made
	console.log('Making HTTP request: ', request.url);
	return request;
});

const cache = new (require('node-cache'))({ stdTTL: 240 }); // Local cache for storing auth tokens
const querystring = require('querystring'); // NodeJS module for creating query string parameters

/**
 * getAuthToken handles making requests to Ethos Integration for authentication tokens.
 * 
 * getAuthToken will use the environment variable `API_KEY` as the
 * API Key for which the authentication token will be generated.
 * 
 * getAuthToken will use a local cache with a 4 minute expiration to avoid hitting
 * Ethos Integration more than it needs to, since auth tokens expire in 5 minutes.
 */
async function getAuthToken() {
	// Check for an existing token, if it exist, return it.
	const existingAuthToken = cache.get('authtoken');
	if (existingAuthToken) {
		return existingAuthToken;
	}

	// No existing token was found, so make a request to Ethos Integration for a new token
	const response = await axios({
		method: 'POST',
		url: 'https://integrate.elluciancloud.com/auth',
		headers: {
			'Authorization': `Bearer ${process.env.API_KEY}`,
		},
	});
	const newAuthToken = response.data;
	cache.set('authtoken', newAuthToken); // Remember to set token in cache since we got a new one

	return newAuthToken;
}

/**
 * getEntities sends a request to Ethos Integration's proxy service and requests for a
 * number of entities with a given name.
 * 
 * For the scope of this project, the 2 potential entity names are `persons` and `marital-statuses`
 * 
 * The `offset` and `limit` parameters are forwarded so that data may be loaded in chunks.
 */
async function getEntities(request, h) {
	try {
		// Forward offset and limit query params to Ethos Integration
		const queryStrings = querystring.stringify({
			offset: request.query.offset,
			limit: request.query.limit,
		});
		const response = await axios({
			method: 'GET',
			url: `https://integrate.elluciancloud.com/api/${request.params.entity}?${queryStrings}`,
			headers: {
				'Authorization': `Bearer ${await getAuthToken()}`,
			},
		});
		const personsData = response.data;

		return h
			.response(personsData)
			.header('x-total-count', response.headers['x-total-count'])
			.header('x-max-page-size', response.headers['x-max-page-size']);
	} catch (e) {
		console.error('Error in getEntities');
		console.error(e.message);
		if (e.response) {
			return h.response(e.response.data).code(e.response.status);
		}
		return h.response({
			message: "Unexpected server error. Check server logs",
			context: e.message,
		}).code(500);
	}
}

/**
 * getEntity sends a request to Ethos Integration's proxy service and requests for an
 * entitiy with a given `id`.
 * 
 * This is useful for getting an updated copy of a `persons` entity from the backend system
 * without having to query more than one object.
 */
async function getEntity(request, h) {
	try {
		const response = await axios({
			method: 'GET',
			url: `https://integrate.elluciancloud.com/api/${request.params.entity}/${request.params.id}`,
			headers: {
				'Authorization': `Bearer ${await getAuthToken()}`,
			},
		});
		const personsData = response.data;

		return h.response(personsData);
	} catch (e) {
		console.error('Error in getEntity:');
		console.error(e.message);
		if (e.response) {
			return h.response(e.response.data).code(e.response.status);
		}
		return h.response({
			message: "Unexpected server error. Check server logs",
			context: e.message,
		}).code(500);
	}
}

/**
 * putEntity sends a request to Ethos Integration's proxy service to
 * modify an entity with a given `id`
 * 
 * Assuming the backend system is hooked up to Ethos Integration, a change
 * notification should appear inside Ethos Integration 
 */
async function putEntity(request, h) {
	try {
		const response = await axios({
			method: 'PUT',
			url: `https://integrate.elluciancloud.com/api/${request.params.entity}/${request.params.id}`,
			headers: {
				'Authorization': `Bearer ${await getAuthToken()}`,
			},
			data: request.payload,
		});
		return h.response(response.data);
	} catch (e) {
		console.error('Error in putEntity');
		console.error(e.message);
		if (e.response) {
			return h.response(e.response.data).code(e.response.status);
		}
		return h.response({
			message: "Unexpected server error. Check server logs",
			context: e.message,
		}).code(500);
	}
}

/**
 * getChangeNotifications sends a request to Ethos Integration to
 * retrieve a list of Change Notifications.
 */
async function getChangeNotifications(request, h) {
	try {
		const response = await axios({
			method: 'GET',
			url: `https://integrate.elluciancloud.com/consume`,
			headers: {
				'Authorization': `Bearer ${await getAuthToken()}`,
			},
		});
		return h.response(response.data);
	} catch (e) {
		console.error('Error in getChangeNotifications');
		console.error(e.message);
		if (e.response) {
			return h.response(e.response.data).code(e.response.status);
		}
		return h.response({
			message: "Unexpected server error. Check server logs",
			context: e.message,
		}).code(500);
	}
}

module.exports = {
	getEntities,
	getEntity,
	putEntity,
	getChangeNotifications,
};