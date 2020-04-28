const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/users');

router.post('/signup', (req, res) => {
	User.find({ email: req.body.email }).exec().then((result) => {
		if (result.length >= 1) {
			return res.status(409).json({ message: 'Email already taken' });
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					return res.status(500).json({ err });
				} else {
					const user = new User({
						_id       : mongoose.Types.ObjectId(),
						email     : req.body.email,
						firstName : req.body.firstName,
						lastName  : req.body.lastName,
						password  : hash
					});
					user.save().then((result) => {
						res.status(201).json({ message: 'User Created', result }).catch((error) => {
							res.status(500).json({ error });
						});
					});
				}
			});
		}
	});
});

router.post('/signin', (req, res) => {
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length < 1) {
				return res.status(401).json({ message: 'wrong username or password' });
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({ message: 'wrong username or password' });
				}
				if (result) {
					const token = jwt.sign({ email: user[0].email, userId: user[0]._id }, process.env.MONGO_ATLAS_PW, {
						expiresIn : '1h'
					});
					return res
						.status(200)
						.json({ token, id: user[0]._id, cart: user[0].cart, firstName: user[0].firstName, lastName: user[0].lastName });
				}
				return res.status(401).json({ message: 'wrong username or password' });
			});
		})
		.catch((err) => {
			res.status(500).json({ message: 'something went wrong' });
		});
});

router.get('/cart/:id', (req, res) => {
	User.find({ _id: req.params.id }).exec().then((user) => {
		if (user.length < 1) {
			return res.status(404).json({ message: 'Invalid user' });
		} else {
			res.status(200).json({ cart: user[0].cart });
		}
	});
});

router.post('/cart', (req, res) => {
	User.find({ _id: req.body.id })
		.exec()
		.then((user) => {
			const record = user[0].cart.find((el) => el.itemId === req.body.item.itemId);
			console.log(record);
			if (record) {
				res.json({ record });
				record.quantity++;
				user[0].save();
			} else {
				user[0].cart.push({
					itemId   : req.body.item.itemId,
					quantity : 1,
					name     : req.body.item.name,
					price    : req.body.item.price,
					imageUrl : req.body.item.imageUrl
				});
				user[0].save();
			}
			res.status(201).json({ message: 'added to cart', user: user[0] });
		})
		.catch((err) => {
			res.status(500).json({ message: 'something went wrong' });
		});
});

module.exports = router;
