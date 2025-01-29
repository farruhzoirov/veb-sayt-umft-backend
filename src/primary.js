const cluster = require('cluster');
const os = require('os');
const  { dirname } = require("path");
const  { fileURLToPath }  = require("url");
const cpuCount = os.cpus().length;
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(`CPU count: ${cpuCount}`);
console.log(`Primary PID: ${process.pid}`);

cluster.setupPrimary({
  exec: __dirname + '/server.js'
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
