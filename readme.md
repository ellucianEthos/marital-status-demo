# Marital Status Demo

This is a demo application that allows a user to update a person's marital status. The application is written in [React](https://reactjs.org/) and [Node.js](https://nodejs.org), and connects to Ethos Integration to read and update data.

## Description

This project demonstrates how a user-facing UI application can be built to utilize the synchronous and asynchronous messaging patterns available in Ethos Integration. The application consists of a client (React) and a server (Node.js). All the Ethos Integration specific communication happens between the server and Ethos Integration.

![](/screenshots/diagram.png)

The server component of this demo needs an API Key to communicate with Ethos Integration. Configuring Ethos Integration and access to the authoritative system is outside the scope of this document. Contact your system admin to obtain an API key.

The server will use the API key to call the /auth endpoint to obtain a JSON Web Token (JWT). The JWT is then used in subsequent calls to /api and /comsume to authenticate access. The server will call the proxy /api to read and update data in the authoritative system - this is the synchronous messaging pattern. When data is updated in the authoritative system, the server will receive a change notification for that data by calling the /consume endpoint - this is the asynchronous messaging pattern.

## Prerequisites

1. Install the [LTS Version of NodeJS](https://nodejs.org/en/). At the time of writing this document / code, it is _10.15.3 LTS_
2. Have an application in Ethos Integration that has valid credentials to an authoritative source system. You will use the API Key from this application later.

## Setup

To run the project:

	git clone https://github.com/ellucianEthos/marital-status-demo.git

	cd marital-status-demo

	npm install

At this point, you'll want to add your Ethos Integration Application's API Key so that the server can connect correctly. To do so:

1. Copy the `./server/default.env` file to a file called `./server/.env`
2. Edit the `API_KEY` line in `./server/.env` so that it contains your API Key from Ethos Integration after the *=* character (e.g. `API_KEY=00000000-0000-0000-0000-000000000000`)

Now that the demo is hooked up to your application, run:

	npm run start

This will start up the service and open your web browser to the main page. Happy Hacking!
