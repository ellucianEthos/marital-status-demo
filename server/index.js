// dotenv is the package we use to pull environment variables. In this app,
// this corresponds to the API_KEY variable (referenced as process.env.API_KEY)
require('dotenv').config();
const server = require('./server');

async function startServer() {
	try {
		await server.start();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	console.log('Server running at:', server.info.uri);
}

startServer();