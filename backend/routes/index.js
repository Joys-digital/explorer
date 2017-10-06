const mongoose = require('mongoose');

const Block = mongoose.model('Block');
const Transaction = mongoose.model('Transaction');
const filters = require('./filters');
const BlockController = require('../controllers/BlockController');
const TxController = require('../controllers/TxController');
const SummaryStatsController = require('../controllers/SummaryStatsController');
const AddressController = require('../controllers/AddressController');
const BroadcastController = require('../controllers/BroadcastController');

module.exports = function (app) {
    app.get('/api/address/:address', AddressController.getAddress);
    app.get('/api/address/:address/mined', AddressController.getMined);
    app.get('/api/tx/:txHash', TxController.getTx);
    app.get('/api/txs/latest', TxController.getLatest);
    app.get('/api/block/:blockNumberOrHash', BlockController.getBlock);
    app.get('/api/block/:blockNumberOrHash/transactions', BlockController.getBlockTransactions);
    app.get('/api/blocks/latest', BlockController.getLatestBlocks);
    app.get('/api/stats', SummaryStatsController.getSummaryStats);
    app.post('/api/broadcast', BroadcastController.broadcast);
};

var getAddr = function (req, res) {
    // TODO: validate addr and tx
    var addr = req.body.addr.toLowerCase();
    var count = parseInt(req.body.count);

    var limit = parseInt(req.body.length);
    var start = parseInt(req.body.start);

    var data = {draw: parseInt(req.body.draw), recordsFiltered: count, recordsTotal: count};

    var addrFind = Transaction.find({$or: [{"to": addr}, {"from": addr}]});

    addrFind.lean(true).sort('-blockNumber').skip(start).limit(limit)
        .exec("find", function (err, docs) {
            if (docs)
                data.data = filters.filterTX(docs, addr);
            else
                data.data = [];
            res.write(JSON.stringify(data));
            res.end();
        });

};


var getTx = function (req, res) {

    var tx = req.body.tx.toLowerCase();

    var txFind = Block.findOne({"transactions.hash": tx}, "transactions timestamp")
        .lean(true);
    txFind.exec(function (err, doc) {
        if (!doc) {
            console.log("missing: " + tx);
            res.write(JSON.stringify({}));
            res.end();
        } else {
            // filter transactions
            var txDocs = filters.filterBlock(doc, "hash", tx);
            res.write(JSON.stringify(txDocs));
            res.end();
        }
    });

};


/*
 Fetch data from DB
 */
var getData = function (req, res) {

    // TODO: error handling for invalid calls
    var action = req.body.action.toLowerCase();
    var limit = req.body.limit

    if (action in DATA_ACTIONS) {
        if (isNaN(limit))
            var lim = MAX_ENTRIES;
        else
            var lim = parseInt(limit);

        DATA_ACTIONS[action](lim, res);

    } else {

        console.error("Invalid Request: " + action)
        res.status(400).send();
    }

};

/* 
 temporary blockstats here
 */
var latestBlock = function (req, res) {
    var block = Block.findOne({}, "totalDifficulty")
        .lean(true).sort('-number');
    block.exec(function (err, doc) {
        res.write(JSON.stringify(doc));
        res.end();
    });
}


var getLatest = function (lim, res, callback) {
    var blockFind = Block.find({}, "number transactions timestamp miner extraData")
        .lean(true).sort('-number').limit(lim);
    blockFind.exec(function (err, docs) {
        callback(docs, res);
    });
}

/* get blocks from db */
var sendBlocks = function (lim, res) {
    var blockFind = Block.find({}, "number transactions timestamp miner extraData")
        .lean(true).sort('-number').limit(lim);
    blockFind.exec(function (err, docs) {
        res.write(JSON.stringify({"blocks": filters.filterBlocks(docs)}));
        res.end();
    });
}

var sendTxs = function (lim, res) {
    Transaction.find({}).lean(true).sort('-blockNumber').limit(lim)
        .exec(function (err, txs) {
            res.write(JSON.stringify({"txs": txs}));
            res.end();
        });
}

const MAX_ENTRIES = 10;

const DATA_ACTIONS = {
    "latest_blocks": sendBlocks,
    "latest_txs": sendTxs
}

