const fs = require('fs');
const csv = require('csvtojson');
const { Transform } = require('stream');
const main = async () => {
	const readStream = fs.createReadStream('./data/oscar_age_male.csv');

	const writeStream = fs.createWriteStream('./data/export.csv');
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
			callback(null, chunk);
		},
	});
	readStream
		.pipe(csv({ delimiter: ',' }, { objectMode: true }))
		.pipe(myTransform)
		.pipe(myFilter)
		.on('data', (data) => {
			console.log('data>>> ');
			console.log(data);
		})
		.on('error', (err) => {
			console.log('stream error: ' + err);
		});

	readStream.on('end', () => console.log('Stream ended'));

	writeStream.on('finish', () => console.log('write stream finished'));
};

main();
