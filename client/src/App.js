import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

import {
    ApolloProvider, //special type of React component that we'll use to providate data to ALL of the other components
    ApolloClient, //constructor function that will help initialize the connection to the GraphQL API server
    InMemoryCache, //enables AC instance to cache API response data so we can perform requests more efficiently
    createHttpLink, //allows us to control how the AC makes a request (like middleware for outbound network requests)
} from "@apollo/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
            <Router>
                <div className="flex-column justify-flex-start min-100-vh">
                    <Header />
                    <div className="container">
                        {/* signifies this part of the app as the place where content will change according to URL route */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            <Route path="/profile">
                                {/* check for /:username parameter first */}
                                <Route path=":username" element={<Profile />} />
                                {/* if none is provided in URL path, then render Profile component w/o */}
                                <Route path="" element={<Profile />} />
                            </Route>

                            <Route
                                path="/thought/:id"
                                element={<SingleThought />}
                            />

                            <Route path="*" element={<NoMatch />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
