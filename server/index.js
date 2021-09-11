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
    if (action.type === "Close") {
        return false;
    }

    console.log("Opening connection...");
    await client.connect().then((res) => console.log("Connected\n")).catch(err => console.log(err));
    //databasesList = await client.db().admin().listDatabases();
    //listDatabasesToConsole(databasesList);

    let output = "";
    //output = await action.func(client);
    output = await action.func(client, action.data);

    console.log("Closing connection...");
    await client.close().then(console.log("Closed\n")).catch(err => console.log(err));

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
    res.send("mongoConnect()");
    // Runs with default Action , does nothing and closes
    mongoConnect(new Action());
});

// Note the use of 'async' in the callback
app.post('/colorpost', async (req, res) => {
    console.log("Request id: " + req.body._id + "\n");
    //console.log("Type of request.body: ", typeof req.body) // Object
    // TODO: server side validation

    let colorData = new Action
    ({ 
        type: "saveColorData", 
        func: saveColorData, 
        data: req.body 
    })
    let attempt = await mongoConnect(colorData)
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

    let action = new Action
    ({ 
        type:"readListing", 
        func: findOneListingByID, 
        data: {id: req.query.id} 
    })
    let attempt = await mongoConnect(action);
    res.send(attempt);
});

app.get('/createlisting', (req, res) => {
    // todo: change this to a post request and use parameters in req to create the listing
    res.send("listing");
    updateInfo = new Action
    ({ 
        type: "createListing", 
        func: createListing, 
        data: listingInfo 
    })
    mongoConnect(updateInfo);
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort} \n`));


// Helper Classes
class Action {
    constructor(props = {}) {
        this.type = props.type || "Close"; // Default Action object causes mongoConnect to return immediately
        this.func = props.func || function(...args) {};
        this.data = props.data || {};
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
