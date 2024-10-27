const cluster = require('cluster');
const os = require('os');

const cpuCount = os.cpus().length;

console.log(`CPU count: ${cpuCount}`);
console.log(`Primary PID: ${process.pid}`);

// Set up the master process
cluster.setupMaster({
    exec: __dirname + '/server.js' // Path to the worker script
});

// Fork worker processes
for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
}

// Handle worker exit
cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    cluster.fork(); // Fork a new worker when one dies
});
