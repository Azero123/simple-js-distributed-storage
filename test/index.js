const DistributedStorage = require('../src/index.js')
console.log( process.argv[2])
const cloud = new DistributedStorage({
    port: process.argv[2]
})


console.log(cloud.storage.save('test'))
console.log('test passed')
