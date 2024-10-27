module.exports = {
    apps: [{
        name: 'my-app',
        script: 'app.js',
        instances: 'max', // or specify a number
        exec_mode: 'cluster',
        // other configurations...
    }]
};