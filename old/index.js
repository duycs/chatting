// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  router = require('./router'),
  mongoose = require('mongoose'),
  socketEvents = require('./socketEvents'),
  config = require('./config/main'),
  cors = require('cors'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');
  //swaggerDocument = require('./swaggerDocument');
  
  //Following
  //https://blog.slatepeak.com/creating-a-real-time-chat-api-with-node-express-socket-io-and-mongodb/

  //TODO: write swagger json doc
  //https://github.com/GenFirst/swagger-to-existing-nodejs-project/blob/master/backend/swagger.json
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database Setup
mongoose.connect(config.database, function(error){
  if(error) {
    console.log(error);
    return;
  }
  console.log("connection successful");
});

// for testing
app.use(cors());

// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  server = app.listen(config.port || 5000);
  console.log(`Your server is running on port ${config.port}.`);
} else{
  server = app.listen(config.test_port || 5000);
}


const io = require('socket.io').listen(server);

socketEvents(io);

// Set static file location for production
// app.use(express.static(__dirname + '/public'));

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


// Import routes to be served
router(app);

//TODO: how to auto generate swagger doc
//http://www.acuriousanimal.com/2018/10/20/express-swagger-doc.html
//swaggerDocument(app);

// necessary for testing
module.exports = server;
