'use strict';

const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const DTOMapper = require('../service/DTOMapper');
const BigNumber = require('bignumber.js');
const filters = require('../routes/filters');
const Web3Service = require('../service/Web3Service');
var etherUnits = require('../libs/etherUnits');

exports.getAddress = function (req, res) {
    etherUnits.toEther(3234, 'wei');
    if (req.params['address'] && new RegExp(/^(0x)([0-9a-z]{40,40})+$/).test(req.params['address'])) {
        let address = req.params['address'];
        Transaction.find({$or: [{"to": address}, {"from": address}]}).lean(true).exec(function (err, transactions) {
            if (err) {
                console.error('Error while getting address info', err, req, res)
                res.status(500).send();
                res.end();
            }
            else {
                let transactionDTOs = [];
                transactions.forEach(function (tx) {
                    transactionDTOs.push(DTOMapper.mapMongooseTransactionToDTO(tx));
                });

                Web3Service.getBalance(address).then(function (balanceInWei) {
                    let balanceInEther = etherUnits.toEther(balanceInWei, 'wei');
                    res.write(JSON.stringify({
                        address: address,
                        balance: balanceInEther,
                        transactions: transactionDTOs
                    }));
                    res.end();
                }, function (error) {
                    res.write(JSON.stringify({
                        address: address,
                        balance: "N/A",
                        transactions: transactionDTOs
                    }));
                    res.end();
                });
            }
        })
    }
    else {
        res.status(400).send();
        res.end();
    }


};
