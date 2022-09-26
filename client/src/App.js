import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

import {
    ApolloProvider, //special type of React component that we'll use to providate data to ALL of the other components
    ApolloClient, //constructor function that will help initialize the connection to the GraphQL API server
    InMemoryCache, //enables AC instance to cache API response data so we can perform requests more efficiently
    createHttpLink, //allows us to control how the AC makes a request (like middleware for outbound network requests)
} from "@apollo/client";

// establish a new link to the GraphQL server at its /graphql endpoint
const httpLink = createHttpLink({
    uri: "/graphql", // fixes issue of absolute path to the server
});
// use the AC constructor to instantiate the AC instance and create the connection to the API endpoint
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

function App() {
    return (
        // because we're passing the client variable in as a prop, everything between JSX tags will eventually have access to server's API datat thru client we set up
        <ApolloProvider client={client}>
            <div className="flex-column justify-flex-start min-100-vh">
                <Header />
                <div className="container">
                    <Home />
                </div>
                <Footer />
            </div>
        </ApolloProvider>
    );
}

export default App;
