const express = require('express');
const app = express();
const { fork } = require('child_process');

app.get('/one', (req, res) => {
	const sum = longComputation();
	res.send({ sum: sum });
});
app.get('/two', async (req, res) => {
	const sum = await longComputePromise();
	res.send({ sum: sum });
});
app.get('/three', (req, res) => {
	const child = fork('./longTask.js');
	child.send('start');
	child.on('message', (sum) => {
		res.send({ sum });
	});
});

app.listen(3000, () => console.log('server on port 3000...'));

function longComputation() {
	let sum = 0;
	for (let i = 0; i < 1000000; i++) {
		sum += i;
	}
	return sum;
}

function longComputePromise() {
	return new Promise((resolve, reject) => {
		let sum = 0;
		for (let i = 0; i < 1000000; i++) {
			sum += i;
		}
		resolve(sum);
	});
}
