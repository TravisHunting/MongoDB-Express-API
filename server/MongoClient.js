const { MongoClient } = require('mongodb');

// Read Database Login info from "secrets.json" file
const fs = require('fs');
// This can happen synchronously because it only happens on startup
let rawdata = fs.readFileSync('../secrets.json');
let logindetails = JSON.parse(rawdata);


class Client {
    constructor(props = {}) {
        this.uri = props.uri || logindetails.uri;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async connect() {
        let success = false;
        await this.client.connect().then(
            function(res) { 
                console.log("Connected\n");
                success = true;
            }).catch(err => console.log(err));
        return success;
    }

    async close() {
        let success = false;
        await this.client.close().then(
            function() {
                console.log("Closed\n");
                success = true;
            }).catch(err => console.log(err));
        return success;
    }

}

// Note the following syntax for exports
module.exports.Client = Client;

// Connect to MongoDB using the code MongoDB suggests
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
