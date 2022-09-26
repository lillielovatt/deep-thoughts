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
