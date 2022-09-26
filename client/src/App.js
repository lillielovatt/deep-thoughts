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

// function setContext creates middleware function that retrieves token for us and combines it with existing httpLink
import { setContext } from "@apollo/client/link/context";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// establish a new link to the GraphQL server at its /graphql endpoint
const httpLink = createHttpLink({
    uri: "/graphql", // fixes issue of absolute path to the server
});

// _, here indicates we do not need access to the parameter that comes first. Cannot skip, it's very specific order, so use _ instead as a placeholder
const authLink = setContext((_, { headers }) => {
    // use setContext function to retrieve token from localStorage and set the HTTP request headers of every req to include the token
    // whether req needs it or not (if req doesn't need token, server-side resolver won't check for it)
    const token = localStorage.getItem("id_token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// use the AC constructor to instantiate the AC instance and create the connection to the API endpoint
// combine authLink and httpLink objects so every req retrieves the token and sets the req headers before making req to API
const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
