// import the gql tagged template function from apollo-server-express
//  Tagged templates are an advanced use of template literals
const { gql } = require("apollo-server-express");

// create out typeDefs
const typeDefs = gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addThought(thoughtText: String!): Thought
        addReaction(thoughtId: ID!, reactionBody: String!): Thought
        addFriend(friendId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;
//addReaction will return the parent Thought instead of newly created Reaction (because front end will track changes on thought level, not reaction level)
// i.e. when someone posts a comment to a thread, you'd want to return the new thread, not just the new comment.

//auth type must return a token, can optionally include any other User data

// login mutation - returns User object, either one who successfully logged in
// ...or user who was just created thru sign up

// ID! indicates that for that query to be carried out, the data MUST exist.
// otherwise, Apollo will return error to client making request and query won't even reach the resolver function assoc with it

// define User, return all data in Mongoose modal
// friends field is an array, populated with data that adheres to User (friends should follow same data pattern as user, since they are also a user)

// thoughts field is array of Thought types. We do have to explicitly define almost all data graphQL works with, but easy to share/reuse data types

// export the typeDefs
module.exports = typeDefs;
