const fs = require('fs');
const csv = require('csvtojson');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');
const { createGzip } = require('zlib');
const main = async () => {
	const readStream = fs.createReadStream('./data/oscar_age_male.csv');

	const myTransform = new Transform({
		objectMode: true,
		transform(chunk, enc, callback) {
			const actress = {
				Index: Number(chunk.Index),
				Year: Number(chunk.Year),
				Age: `${Number(chunk.Age)} Years Old`,
				Name: chunk.Name,
				Movie: `Name Of Movie: ${chunk.Movie}`,
			};
			// console.log('>> chunck', actress);
			callback(null, actress);
		},
	});
	const myFilter = new Transform({
		objectMode: true,
		transform(chunk, enc, callback) {
			if (chunk.Year < 2010) {
				callback(null);
				return;
			}
			console.log(chunk);

			callback(null, chunk);
		},
	});
	const convertToNDJson = new Transform({
		objectMode: true,
		transform(chunk, enc, callback) {
			const value = JSON.stringify(chunk) + '\n';
			callback(null, value);
		},
	});
	try {
		await pipeline(
			readStream,
			csv({ delimiter: ',' }, { objectMode: true }),
			myTransform,
			myFilter,
			//saving to file
			convertToNDJson,
			createGzip(), // zip the file
			fs.createWriteStream('./data/export.ndjson')
		);
		console.log('stream ended');
	} catch (error) {
		console.error('stream ended with error: ', error);
	}
};

main();
