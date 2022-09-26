// get our Apollo server hooked into our existing Express.js server and set it up with our type definitions and resolvers
const { authMiddleware } = require("./utils/auth");
const path = require("path");
const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware, //ensures that every request performs an authentication check, and updated reject object will be passed to resolvers as the context
    // ({ req }) => req.headers, new instance of ApolloServer, you can pass in a context method
    //that is set to return whatever you want available to resolvers. This sees incoming request and returns only headers
    // on resolver side, these headers are context parameter
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve up static assets (only goes into effect when we go into production)
// if it is in production, we tell Express.js server to serve any files in React app's build directory in client folder
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}
// wildcard GET route for server--if we make a GET request to any locatio on server that doesn't have an explicit route defined,
// respond with production ready React front end code
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// create a new instance of an Apollo server with the GraphQl schema
const startApolloServer = async () => {
    await server.start();

    // integrate our Apollo server with the Express application as middleware
    server.applyMiddleware({ app });

    db.once("open", () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            // log where we can go to test our GQL API
            console.log(
                `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
            );
        });
    });
};

// call the async function to start the server
startApolloServer();
