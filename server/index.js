// https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const apiPort = 5000;

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://travis1:travis99@cluster0.z0l64.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// Connect to MongoDB with an async function
async function mongoConnect() {
    console.log("started.");
    await client.connect().catch(err => console.log(err));
    console.log("Chicken");
    //await listDatabases(client).catch(err => console.log(err));
    await client.close().catch(err => console.log(err));
}

async function ss() {}

// Connect to MongoDB with a promise + callbacks 
//client.connect().then(); // .....



// Connect to MongoDB using the code MongoDB suggests
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



// Alternative to bodyParser is now included in express
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    //res.send(mongoConnect());
    res.send(" '/' reached");
});

app.get('/mongo', (req, res) => {
    //console.log("stfs");
    mongoConnect();
    res.send("mongoConnect()");
    //res.send(" '/mongo' reached");
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));