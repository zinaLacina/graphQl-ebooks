const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

//Allow Access-Control-Allow-Origin
app.use(cors());

mongoose.connect("mongodb://root:root2018@ds253922.mlab.com:53922/gql-ninja");
mongoose.connection.once('open',()=>{
	console.log("connected to the database");
});

app.use('/graphql',graphqlHTTP({
	schema,
	graphiql:true
}));

app.listen(4000,()=>{
	console.log("Now listen in the port 4000");
});
