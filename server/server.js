// get our Apollo server hooked into our existing Express.js server and set it up with our type definitions and resolvers
const { authMiddleware } = require("./utils/auth");
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
