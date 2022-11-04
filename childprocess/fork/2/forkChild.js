const data = process.argv.slice(2);

function sayHello(names) {
	names.forEach((name) => {
		process.send(`Greeting ${name}`);
	});
}

sayHello(data);

process.on('message', (parentData) => {
	console.dir(parentData, { colors: true });
});
