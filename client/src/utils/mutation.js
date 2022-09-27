import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;
// accepts 2 variables, $email and $password, values we will set up to be passed in as args
// in return we expect logged-in user's data and token (with token, we can do other items unique to logged in users ONLY)

export const ADD_USER = gql`
    mutation addUser($email: String!, $password: String!, $username: String!) {
        addUser(email: $email, password: $password, username: $username) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_FRIEND = gql`
    mutation addFriend($id: ID!) {
        addFriend(friendId: $id) {
            _id
            username
            friendCount
            friends {
                _id
                username
            }
        }
    }
`;

export const ADD_THOUGHT = gql`
    mutation addThought($thoughtText: String!) {
        addThought(thoughtText: $thoughtText) {
            _id
            thoughtText
            createdAt
            username
            reactionCount
            reactions {
                _id
            }
        }
    }
`;

export const ADD_REACTION = gql`
    mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
        addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
            _id
            reactionCount
            reactions {
                _id
                reactionBody
                createdAt
                username
            }
        }
    }
`;
