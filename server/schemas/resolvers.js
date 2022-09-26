const { User, Thought } = require("../models");
// graphQL has error handling built in, if user tries to login with wrong username/pw, we return an authentication error
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

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
        me: async (parent, args, context) => {
            //check for existence of context.user (if none exists, then we know user ISN'T authenticated and we can throw error)
            if (context.user) {
                const userData = await User.findOne({})
                    .select("-__v -password")
                    .populate("thoughts")
                    .populate("friends");
                return userData;
            }
            throw new AuthenticationError("Not logged in");
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            // Mongoose User model creates a new user in db with whatever is passed in as args
            const user = await User.create(args);
            const token = signToken(user); //sign a token, then return object that combines token + user's data
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            // normally, an error would cause server to crash--GraphQL catches the error and sends it to client instead
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Incorrect credentials"); //do not indicate if username or PW is incorrect
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = signToken(user);

            return { token, user };
        },
        addThought: async (parent, args, context) => {
            // only logged in users should be able to add thoughts, hence why we check
            if (context.user) {
                const thought = await Thought.create({
                    ...args,
                    username: context.user.username,
                });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    { new: true } //without this, Mongo would return original document vs updated document
                );

                return thought;
            }
            throw new AuthenticationError("You need to be logged in!");
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId }, //because you're updating an existing thought, need the id
                    {
                        $push: {
                            //reactions stored as arrays on Thought model, so use $push operator
                            reactions: {
                                reactionBody,
                                username: context.user.username,
                            },
                        },
                    },
                    { new: true, runValidators: true }
                );
                return updatedThought;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } }, //will look for an incoming friendId and add that to the current user's friends array
                    // using addToSet and now push prevents someone befriending someone twice (i.e. no duplicates)
                    { new: true }
                ).populate("friends");

                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
    },
};

// when we query thoughts, we will perform a find method on Thought model
// return data in DESC order

module.exports = resolvers;
