const { MongoClient } = require('mongodb');

class Client {
    constructor(props = {}) {
        this.uri = props.uri || "mongodb+srv://travis1:travis99@cluster0.z0l64.mongodb.net/Cluster0?retryWrites=true&w=majority";
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