function longCompute() {
	let sum = 0;
	for (let i = 0; i < 1000000; i++) {
		sum += i;
	}
	return sum;
}
process.on('message', (message) => {
	if (message === 'start') {
		const sum = longCompute();

		process.send(sum);
	}
});
