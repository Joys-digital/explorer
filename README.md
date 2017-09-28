# SHAFT explorer 

## Local installation

Clone the repo

`git clone https://github.com/shaftsh/explorer`

Download [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install") if you don't have them

Install dependencies:

`npm install`

Install mongodb:

MacOS: `brew install mongodb`

Ubuntu: `sudo apt-get install -y mongodb`

## Populate the DB

This will fetch and parse the entire blockchain from block #0 and listen for fresh blocks.

Edit constants in grabber.js if you have different hostname and port for local geth

### Run:

`node ./tools/grabber.js`

Leave this running in the background to continuously fetch new blocks.

## Run the application

This will delploy application on 3000 port

### Run:

`node app.js`

Open http://127.0.0.1:3000/ to open shaft explorer
