const os = require('os');
const HashStore = require('simple-js-hash-store')
const http = require('http')

class DistributedStorage {
    constructor(config = {}) {
        Object.assign(this, config)
        this.port |= 4321
        this.peers |= []
        this.storage = new HashStore('./data')
        this.storage.save('test')
        console.log('creating server...')
        this.httpServer = http.createServer(
            (request, response) => {
                try {
                    const method = request.method.toLowerCase()
                    const methods = {
                        'post': this.post.bind(this, request, response),
                        'get': this.get.bind(this, request, response)
                    }
                    if (methods[method]) {
                        return methods[method]()
                    }
                    throw 'not implemented'
                } catch (error) {
                    console.error(error)
                }
                response.end()
            }
        )
        .listen(this.port, '::')
        .listen(this.port, '0.0.0.0')
        .on('error', () => {
            console.error('unable to serve network')
        })
        // setInterval(() => this.update(), 100)
    }
    update() {
        // console.log(os.EOL)
        // console.log(os.arch())
        // console.log(os.cpus())
        // console.log(os.hostname())
        // console.log(os.endianness())
        // console.log(os.platform())
        // console.log(os.release())
        // console.log(os.type())
        // console.log(os.uptime())
        // console.log(os.userInfo())
        // console.log(process.memoryUsage())
        // console.log(performance.memory.jsHeapSizeLimit) // will give you the JS heap size
        // console.log(performance.memory.usedJSHeapSize) // how much you're currently using
 
        var gigaByte = 1 / (Math.pow(1024, 3)); 
        console.log('Total Memory', os.totalmem() * gigaByte, 'GBs'); 
        console.log('Available Memory', os.freemem() * gigaByte, 'GBs'); 
        console.log('Percent consumed', 100 * (1 - os.freemem() / os.totalmem()));
        // console.log(os.totalmem())
    }
    async seek(reference) {
        console.log(this.peers.length)
    }
    get(request, response) {
        const components = request.url.split('/')
        if (components.length === 2) {
            const reference = components[1]
            response.statusCode = 200
            if (this.storage.get(reference)) {
                return response.end(this.storage.get(reference))
            }
            return await this.seek(reference)
        }
        else {
            response.statusCode = 404
            response.end()
        }
    }
    post(request, response) {
        console.log(request)
        let data = ''
        request.on('data', packet => {
            data += packet
        })
        request.on('end', () => {
            this.storage.save(data)
            response.statusCode = 201
            response.end()
        })
    }
}
module.exports = DistributedStorage