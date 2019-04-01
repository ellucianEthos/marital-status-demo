/**
 * This server exists to proxy requests to Ethos Integration so that the
 * UI can make requests without having to worry about CORS policies
 */

const Hapi = require('hapi');
const handlers = require('./handlers');

// Configure the server to run on port 8080
// Also will log out basic information when an error occurs
const server = new Hapi.Server({
	port: 8080,
	debug: {
		request: ['error'],
	},
});

// Define the server routes
server.route([
	{
		method: ['GET'],
		path: '/api/{entity}',
		handler: handlers.getEntities,
	},
	{
		method: ['GET'],
		path: '/api/{entity}/{id}',
		handler: handlers.getEntity,
	},
	{
		method: ['PUT'],
		path: '/api/{entity}/{id}',
		handler: handlers.putEntity,
	},
	{
		method: ['GET'],
		path: '/api/consume',
		handler: handlers.getChangeNotifications,
	},
]);

module.exports = server;
