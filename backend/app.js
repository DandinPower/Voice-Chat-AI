require('dotenv').config()
const { server } = require('./server');

server.listen(process.env.SERVER_PORT)