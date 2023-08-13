const express = require('express'); //Creating Express service
const app = express();
const mongoose = require('mongoose'); 
const { config } = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');
const productsRouter = require('./routes/product');
const categoriesRouter = require('./routes/category');
const api = process.env.API_URL;

//Allowing all http request from other origins
app.use(cors());
app.options('*',cors());


//Checking connection to DB
mongoose.connect(process.env.MONGODB_URL, {
useNewUrlParser: true,useUnifiedTopology:true,dbName:'Phone-shop'
}).then(()=>{
    console.log('Database Connection is ready...')
}).catch((err)=>{
    console.log(err);
});

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routers
//http://localhost:3000/api/v1/products
app.use(`${api}/products`,productsRouter);
//http://localhost:3000/api/v1/category
app.use(`${api}/category`,categoriesRouter);





//open server for listening
const port = process.env.PORT
app.listen(port, () => {
    console.log(api);
    console.log('server is running on port ' + port)
    });

