const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('../models/users');
const Transfers = require('../models/transfers');
const cors = require('./cors');
const allusersRouter = express.Router();


allusersRouter.use(bodyParser.urlencoded({
    extended: true
}));

allusersRouter.use(bodyParser.json());

allusersRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Users.find(req.query)
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Users.create(req.body)
            .then((dish) => {
                console.log('Dish Created ', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Users');
    })
    .delete((req, res, next) => {
        Users.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

allusersRouter.route('/:userId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Users.find({ id: req.params.userId })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user[0]);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Users/' + req.params.dishId);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        var names = [];
        var transferReceivers = []
        for (index in req.body.recepients.recepients) {
            names.push(req.body.recepients.recepients[index].name);
            transferReceivers.push(req.body.recepients.recepients[index]);
        }
        var fine = true;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        Users.find({ id: req.params.userId })
            .then((id) => {
                var total = 0;
                Users.find({ name: { $in: names } })
                    .then((user) => {
                        for (index in user) {
                            var transferAmount = parseInt(req.body.recepients.recepients[index].amount);
                            total = total + transferAmount;
                        }
                        for (index in user) {
                            var userCheck = user[index]._id + '';
                            var idCheck = id[0]._id + '';
                            if (total > id[0].credit || (userCheck.toString().trim() === idCheck.toString().trim())) {
                                res.json({ msg: 'ERROR' });
                                fine = false;
                                break;
                            }
                            else {
                                var updatedReceiverCredit = user[index].credit + transferAmount;
                                Users.findByIdAndUpdate(user[index]._id, {
                                    $set: { credit: updatedReceiverCredit }
                                }, { new: true }).then(() => { }).catch((err) => next(err));
                            }
                        }
                        if (fine) {
                            Users.findByIdAndUpdate(id[0]._id, {
                                $set: { credit: (id[0].credit - total) }
                            }, { new: true }).then(() => { }).catch((err) => next(err));
                            Transfers.insertMany({
                                senderId: req.body.userId,
                                receivers: transferReceivers
                            });
                            res.json(null)
                        }
                    })
            })
    })
    .delete((req, res, next) => {
        Users.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = allusersRouter;