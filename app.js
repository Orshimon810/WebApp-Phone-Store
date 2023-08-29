const express = require('express');
const http = require('http');
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app); 
const io = socketIo(server, {
    cors: {
      origin: '*' 
    }
  });
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');
const productsRouter = require('./routes/product');
const categoriesRouter = require('./routes/category');
const userRouter = require('./routes/User');
const branchRouter = require('./routes/branch');
const orderRouter = require('./routes/orders');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const api = process.env.API_URL;

// Allow all http requests from other origins
app.use(cors());
app.options('*', cors());

// Checking connection to DB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Phone-shop'
}).then(() => {
  console.log('Database Connection is ready...')
}).catch((err) => {
  console.log(err);
});

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);


// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoriesRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/branch`, branchRouter);

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/socket.io/client-dist/socket.io.js'));
});

// Socket.io chat events
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (message) => {
    console.log('Message:', message);
    io.emit('chat message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



// Open server for listening
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(api);
  console.log('Server is running on port ' + port);
});
