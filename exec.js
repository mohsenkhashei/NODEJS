const { exec } = require('child_process');

exec('ls -lh', (err, stdout, stderr) => {
	if (err) {
		console.log(`error: ${error.message}`);
		return;
	}

	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}
	console.log(`stdout: ${stdout}`);
});
