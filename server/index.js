// https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66
// https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database

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
    await client.connect().then(console.log("connect 'then' happened")).catch(err => console.log(err));
    await listDatabases(client).catch(err => console.log(err));
    await client.close().catch(err => console.log(err));
}

async function listDatabases() {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases Available:");
    //console.log("is databasesList a promise?" + databasesList instanceof Promise)
    databasesList.databases.forEach(db => console.log(db.name));
}


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
    res.send(" '/' reached");
});

app.get('/mongo', (req, res) => {
    res.send("mongoConnect()");
    mongoConnect();
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));