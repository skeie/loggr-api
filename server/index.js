if (process.env.WORKER) {
    require('../worker/fire');
} else {
    require('./spark');
}
