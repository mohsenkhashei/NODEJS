/**
 * child process with fork that communicate with forkChild.js
 * child to parent
 * parent to child
 */

const childProcess = require('child_process');

const names = ['mohsen', 'hasan', 'bahar', 'joe'];

const child = childProcess.fork('forkChild.js', names, { cwd: './' });

child
	.on('message', (data) => {
		console.log(`parent recieved ${data}`);
	})
	.on('exit', () => {
		console.log('child terminated!');
	})
	.on('error', (err) => {
		console.log(err);
	});

// sending message to child
let interval = setInterval(() => {
	child.send({ name: 'mohsen', age: 30, country: 'cyprus' });
}, 1000);

setTimeout(() => {
	clearInterval(interval);
	child.kill();
}, 5000);
