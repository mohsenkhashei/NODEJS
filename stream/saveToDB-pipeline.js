const fs = require('fs');
const csv = require('csvtojson');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

const mongoose = require('mongoose');
const ActressModel = require('./model/Actress');

const main = async () => {
	await mongoose.connect('mongodb://localhost:27017/myapp');
	const readStream = fs.createReadStream('./data/oscar_age_male.csv');

	const myTransform = new Transform({
		objectMode: true,
		transform(chunk, enc, callback) {
			const actress = {
				Index: Number(chunk.Index),
				Year: Number(chunk.Year),
				Age: Number(chunk.Age),
				Name: chunk.Name,
				Movie: chunk.Movie,
			};
			// console.log('>> chunck', actress);
			callback(null, actress);
		},
	});

	const saveActress = new Transform({
		objectMode: true,
		async transform(chunk, enc, callback) {
			await ActressModel.create(chunk);
			callback(null);
		},
	});

	try {
		await pipeline(
			readStream,
			csv({ delimiter: ',' }, { objectMode: true }),
			myTransform,

			//saving to db
			saveActress
		);
		console.log('stream ended');
		process.exit(0);
	} catch (error) {
		console.error('stream ended with error: ', error);
	}
};

main();
