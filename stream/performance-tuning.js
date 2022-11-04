const fs = require('fs');
const csv = require('csvtojson');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

const mongoose = require('mongoose');
const ActressModel = require('./model/Actress');

const bufferingObjectStream = require('buffering-object-stream');
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

			callback(null, actress);
		},
	});

	const saveActress = new Transform({
		objectMode: true,
		async transform(chunk, enc, callback) {
			// use bulk to perform much much faster to insert
			await ActressModel.bulkWrite(
				chunk.map((actress) => ({ insertOne: { document: actress } }))
			);
			callback(null);
		},
	});

	try {
		await pipeline(
			readStream,
			csv({ delimiter: ',' }, { objectMode: true }),
			myTransform,
			//performance inserting to db
			bufferingObjectStream(200), // find the best number with your data
			saveActress
		);
		console.log('stream ended');
		process.exit(0);
	} catch (error) {
		console.error('stream ended with error: ', error);
	}
};

main();
