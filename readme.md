# elive-2019-demo

## About the Project

Jeff to fill in content here

Pretend there's lots of content here - Jeff will fill in some of the data here about the concept / purpose of the project. I can discuss what tools it uses here too, if we so decide to go that route.

---

## Prerequisites

1. Install the [LTS Version of NodeJS](https://nodejs.org/en/). At the time of writing this document / code, it is _10.15.3 LTS_
2. Have an application in Ethos Integration that has valid credentials to an authoritative source system. You will use the API Key from this application later.

## Setup

To run the project:

	git clone [public github link](https://www.youtube.com/watch?v=oHg5SJYRHA0)

	cd elive-2019-demo

	npm install

At this point, you'll want to add your Ethos Integration Application's API Key so that the server can connect correctly. To do so:

1. Copy the `./server/default.env` file to a file called `./server/.env`
2. Edit the `API_KEY` line in `./server/.env` so that it contains your API Key from Ethos Integration after the *=* character (e.g. `API_KEY=00000000-0000-0000-0000-000000000000`)

Now that the demo is hooked up to your application, run:

	npm run start

This will start up the service and open your web browser to the main page. Happy Hacking!