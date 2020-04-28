const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id       : mongoose.Schema.Types.ObjectId,
	email     : {
		type     : String,
		required : true,
		unique   : true,
		match    : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password  : { type: String, required: true },
	firstName : String,
	lastName  : String,
	cart      : [
		{ name: String, quantity: Number, id: String, price: Number, itemId: Number, imageUrl: String }
	]
});

module.exports = mongoose.model('Users', userSchema);
