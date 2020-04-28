const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
	.connect(
		`mongodb+srv://patrickjasonduque:${process.env
			.MONGO_ATLAS_PW}@vue-express-bwhrc.mongodb.net/test?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log('Connected'))
	.catch((err) => console.log('Caught', err.stack));

app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);

app.get('/', (req, res) => {
	res.json({ message: 'hello' });
});

app.listen(port);
console.log(`listening in port ${port}`);
