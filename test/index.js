const DistributedStorage = require('../src/index.js')
const storage = new DistributedStorage()

console.log(storage.storage.save('test'))
console.log('test passed')
