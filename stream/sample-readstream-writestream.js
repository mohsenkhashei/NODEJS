const fs = require('fs');

const main = async () => {
	const readStream = fs.createReadStream('./data/oscar_age_male.csv', {
		// highWaterMark: 100,
	});

	const writeStream = fs.createWriteStream('./data/export.csv');

	readStream.on('data', (buffer) => {
		console.log(`>>> DATA: `);
		console.log(buffer.toString());

		writeStream.write(buffer);
	});

	readStream.on('end', () => {
		console.log('Stream ended');

		writeStream.end();
	});
};

main();
