# JOYS explorer 

thnx https://github.com/shaftsh


## Local installation

Clone the repo

`git clone https://github.com/Joys-digital/explorer`

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

Open http://127.0.0.1:3000/ to open  explorer



## Docker

To run inside docker, you should build it by your self, and run the container.
If you want to run testnet explorer, simply set TESTNET=1 in start.sh


```docker build -t joys/explorer .```

```docker run -d -p 8080:3000 --restart=always --name explorer joys/explorer```

This will expose explorer on port 8080. Be patient, explorer need some time to fetch blockchain.