# Express server with MongoDB connection

Resources: <br>
https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66 <br>
https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database <br>
https://www.mongodb.com/developer/quickstart/node-crud-tutorial/ <br>

# Notes

Entry point: index.js
App runs on port 5000

# Using the mongoConnect function

First create an Action object. Make sure to define its 'type' (currently arbitrary except for "Close")
Define Action.func as the function you will be calling
Define Action.data as the data that will be passed into Action.func
Pass your Action into mongoConnect. 

mongoConnect will then attempt to open a connection to the database, then run your specified function with the data you have chosen.
