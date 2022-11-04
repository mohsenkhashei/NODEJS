const mongoose = require('mongoose');
const actressModel = mongoose.Schema(
	{
		name: String,
		year: Number,
		Age: Number,
		Movie: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Actress', actressModel);
