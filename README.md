# Express server with MongoDB connection

Resources: <br>
https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66 <br>
https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database <br>
https://www.mongodb.com/developer/quickstart/node-crud-tutorial/ <br>

# Notes

Entry point: index.js <br>
App runs on port 5000 <br>
Login details for mongodb are contained in "secrets.json" <br>
Make sure to call client.close() after you are done with your database operations. <br>
The databases and collections used in the server are MongoDB sample data. You can easily load these sample databases when creating a new free MongoDB Atlas Cluster.