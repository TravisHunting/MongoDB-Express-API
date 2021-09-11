// https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66
// https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
// https://www.mongodb.com/developer/quickstart/node-crud-tutorial/

const express = require('express');
//const bodyParser = require('body-parser'); // Deprecated, use express.urlencoded
const cors = require('cors');

const app = express();
const apiPort = 5000;

// Custome class that carries login details and handles opening/closing DB connection
const { Client } = require('./mongoclient.js');
let client = new Client();

// MongoDB Functions
// TODO: enclose functions in Classes / A class
async function createListing(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    // 6139cb89bad1e74e8354d9f3 - id of listing I should have posted
}

async function readAllListings(client, query = {}){
    console.log("Reading all listings");
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({});
    console.log(result);
}

function listDatabasesToConsole(databasesList) {
    databasesList.databases.forEach(database => console.log(database.name));
}

async function findOneListingByID(client, query) {
    // Pass an empty object to findOne({}) to get all the records in the collection
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ _id: query.id });
    if (result) {
        console.log(`Found a listing in the collection with the id '${query.id}':`);
        console.log(result);
        return result;
    } else {
        console.log(`No listings found with the id '${query.id}'`);
        return false;
    }
}

async function saveColorData(client, colorData) {
    console.log("Entered saveColorData function\n");
    //console.log(colorData._id);
    let success = false;
    // TODO: Catch MongoServerError: E11000 duplicate key error in the catch statement below

    await client.db("colordata").collection("rgb_palettes_3").insertOne(colorData)
        .then(function() {
            console.log("Inserted\n");
            success = true;
        }).catch(function(err) { 
            console.log("Insertion failed:");
            console.log(err.message + "\n");
            return false;
        });

    return success;
}

function preloadAsyncFunction(funcToLoad, data) {
    // Curries an async function so that it can be called with only a 'client' parameter
    // let colorData = new Action({ type: "saveColorData", func: preloadAsyncFunction(saveColorData, req.body) })
    // action.func(client)
    return async function(client) { 
        let output = await funcToLoad(client, data);
        return output; 
    }
}

// Express Setup

// Alternative to bodyParser is now included in express
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// Necessary to recognize incoming JSON data
app.use(express.json());

// Allow cross origin requests
app.use(cors());

app.get('/', (req, res) => {
    res.send(" '/' reached");
});

app.get('/mongo', (req, res) => {
    res.send("You've reached /mongo");
});

// Note the use of 'async' in the callback
app.post('/colorpost', async (req, res) => {
    console.log("Request id: " + req.body._id + "\n");
    //console.log("Type of request.body: ", typeof req.body) // Object
    // TODO: server side validation

    await client.connect();
    let attempt = await saveColorData(client.client,req.body);
    client.close();

    console.log("Success? : ", attempt); //bool

    if (attempt) {
        res.send({body:"Successfully saved",success: true});
    } else {
        res.send({body:"Data was not saved", success: false});
    }
});

app.get('/readlisting', async (req, res) => {
    // To use the id parameter, do this: 
    // http://localhost:5000/readlisting?id=10006546
    // Sample ID: 10006546
    let query = {id: req.query.id}

    await client.connect();
    let attempt = await findOneListingByID(client.client,query);
    client.close();

    res.send(attempt);
});

app.get('/createlisting', async (req, res) => {
    // todo: change this to a post request and use parameters in req to create the listing
    let data = listingInfo;

    await client.connect();
    let attempt = await createListing(client.client,data);
    client.close();

    res.send("listing");
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort} \n`));

// Test data
let listingInfo = {
    name: "Lovely Loft",
    summary: "A charming loft in Paris",
    bedrooms: 1,
    bathrooms: 1
};
