const express = require('express');


const router = express.Router();
const User = require('../models/users');

router.get('/:id', (req, res) => {
	User.find({ _id: req.params.id }).exec().then((user) => {
		if (user.length < 1) {
			return res.status(404).json({ message: 'Invalid user' });
		} else {
			res.status(200).json({ cart: user[0].cart });
		}
	});
});

router.post('/:id', (req, res) => {
	User.find({ _id: req.params.id })
		.exec()
		.then((user) => {
			const record = user[0].cart.find((el) => el.itemId === req.body.itemId);
			if (record) {
				res.json({ record });
				record.quantity++;
				user[0].save();
			} else {
				user[0].cart.push({
					itemId   : req.body.itemId,
					quantity : 1,
					name     : req.body.name,
					price    : req.body.price,
					imageUrl : req.body.imageUrl
				});
				user[0].save();
			}
			res.status(201).json({ message: 'added to cart', user: user[0] });
		})
		.catch((err) => {
			res.status(500).json({ message: 'something went wrong' });
		});
});

router.delete('/:id/:itemId', (req, res) => {
	User.updateOne(
		{ _id: req.params.id },
		{
			$pull : {
				cart : {
					itemId : [
						req.params.itemId
					]
				}
			}
		}
	)
		.then((result) => {
			res.status(201).json({ result });
		})
		.catch((err) => {
			res.status(500).json({ message: 'something went wrong' });
		});
});



module.exports = router;
