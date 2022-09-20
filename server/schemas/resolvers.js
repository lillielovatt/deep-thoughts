const { User, Thought } = require("../models");

const resolvers = {
    Query: {
        // parent is kind of a placeholder parameter, won't be used, need something in that 1st param's spot so we can access 2nd param
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {}; //check if username exists
            return Thought.find(params).sort({ createdAt: -1 }); //if username, lookup by specific. if not, return every thought
        },
        // get one specific `
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
                .select("-__v -password") //omit Mongoose specific __v property, and user's pw info
                .populate("friends")
                .populate("thoughts");
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select("-__v -password")
                .populate("friends")
                .populate("thoughts");
        },
    },
};

// when we query thoughts, we will perform a find method on Thought model
// return data in DESC order

module.exports = resolvers;
