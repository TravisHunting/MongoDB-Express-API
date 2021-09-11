// https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66
// https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
// https://www.mongodb.com/developer/quickstart/node-crud-tutorial/

const express = require('express');
//const bodyParser = require('body-parser'); // Deprecated, use express.urlencoded
const cors = require('cors');

const app = express();
const apiPort = 5000;

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://travis1:travis99@cluster0.z0l64.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// MongoDB Functions

// Connect to MongoDB with an async function
async function mongoConnect(action = new Action()) {
    console.log("started.");
    await client.connect().then((res) => console.log("Connection response:", res)).catch(err => console.log(err));
    databasesList = await client.db().admin().listDatabases();
    //listDatabasesToConsole(databasesList);

    let output = "";
    switch (action.type) {
        case "createListing":
            console.log("Attempting to create listing");
            console.log(action.data.listing)
            await createListing(client,action.data.listing)
            break;   
        case "readListing":
            console.log("Attempting to read listing");
            console.log(action.query)
            await findOneListingByID(client, action.query);
            break;
        case "saveColorData":
            console.log("Attempting to save color data");
            output = await saveColorData(client, action.data);
            break;
        default:
            break;
    }

    await client.close().catch(err => console.log(err));

    return output;
}

// TODO: enclose functions in Classes
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
    } else {
        console.log(`No listings found with the id '${query.id}'`);
    }
}

async function saveColorData(client, colorData) {
    console.log("Entered saveColorData function with data:");
    console.log(colorData);
    let success = false;
    // TODO: Catch MongoServerError: E11000 duplicate key error in the catch statement below

    await client.db("colordata").collection("rgb_palettes").insertOne(colorData)
        .then(function() {
            console.log("Inserted");
            success = true;
        }).catch((err) => console.log(err));

    return success;
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
    res.send("mongoConnect()");
    // Runs with default Action , does nothing and closes
    mongoConnect(new Action());
});

// Note the use of 'async' in the callback
app.post('/colorpost', async (req, res) => {
    console.log(req.body);
    console.log(typeof req.body) // Object
    // TODO: server side validation

    let colorData = new Action({type: "saveColorData",  data: req.body })
    let attempt = await mongoConnect(colorData)
    console.log("logging attempt variable (success):");
    console.log(attempt); //bool

    if (attempt) {
        res.send({body:"Successfully saved"});
    } else {
        res.send({body:"Data was not saved"});
    }
});

app.get('/readlisting', (req, res) => {
    // todo: add id param at end of /readlisting url and feed that param into the query
    res.send("reading airbnb reviews");
    mongoConnect(new Action({type:"readListing", query: {id: '10006546'}}));
});

app.get('/createlisting', (req, res) => {
    // todo: change this to a post request and use parameters in req to create the listing
    res.send("listing");
    updateInfo = new Action("createListing", { listing: listingInfo })
    mongoConnect(updateInfo);
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));


// Helper Classes
class Action {
    constructor(props = {}) {
        this.type = props.type || "Close";
        this.data = props.data || {};
        this.query = props.query || new Query();
    }
}

class Query {
    constructor(props = {}) {
        this.id = props.id || "";
    }
}

// Test data
let listingInfo = {
    name: "Lovely Loft",
    summary: "A charming loft in Paris",
    bedrooms: 1,
    bathrooms: 1
};

// Connect to MongoDB using the code MongoDB suggests
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
