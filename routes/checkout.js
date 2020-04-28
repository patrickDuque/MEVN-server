const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SK);

const User = require('../models/users');

const router = express.Router();

router.post('/:id', (req, res) => {
	stripe.charges.create(
		{
			amount        : req.body.amount,
			currency      : 'php',
			source        : req.body.token.id,
			description   : req.body.description,
			receipt_email : req.body.email
		},
		(err, charge) => {
			if (err) {
				return res.status(500).json({ err });
			}
			if (charge) {
				User.update({ _id: req.params.id }, { $set: { cart: [] } }, (err, affected) => {
					console.log({ affected });
				});
				return res.json({ charge });
			}
		}
	);
});

module.exports = router;
