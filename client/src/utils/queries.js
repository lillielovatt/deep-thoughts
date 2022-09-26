// store all the GraphQL query requests

import { gql } from "@apollo/client";

export const QUERY_THOUGHTS = gql`
    query thoughts($username: String) {
        thoughts(username: $username) {
            _id
            thoughtText
            createdAt
            username
            reactionCount
            reactions {
                _id
                createdAt
                username
                reactionBody
            }
        }
    }
`;
//we wrapped the entire query code in a tagged template literal using gql function
// saved it as QUERY_THOUGHTS so we can export it and then import and use it by name anywhere we need
