#!/usr/bin/env node

const nodecron = require('node-cron');
const mongoose = require('mongoose');

const SummaryStats = mongoose.model('SummaryStats');


const Web3 = require("web3");
const BigNumber = require('bignumber.js');
const etherUnits = require("./../libs/etherUnits.js")

let web3;

if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

if (web3.isConnected())
    console.log("Web3Service: Web3 connection established");
else
    throw "Web3Service: No connection";


function getBalance(address) {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


function sendRawTx(tx) {
    return new Promise((resolve, reject) => {
        web3.eth.sendRawTransaction(tx, function (err, hash) {
            if (err) {
                reject(err)
            }
            else {
                resolve(hash)
            }
        });
    });

}

module.exports = {
    getBalance: getBalance,
    sendRawTx: sendRawTx,
};

