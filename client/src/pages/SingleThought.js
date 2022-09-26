import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHT } from "../utils/queries";
import ReactionList from "../components/ReactionList";

const SingleThought = (props) => {
    const { id: thoughtId } = useParams();
    const { loading, data } = useQuery(QUERY_THOUGHT, {
        variables: { id: thoughtId }, //2nd arg in form of an object
        // this is how you can pass variables to queries that need them
        // id property on variables object will become the $id parameter in GraphQL query
    });

    const thought = data?.thought || {};
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="card mb-3">
                <p className="card-header">
                    <span style={{ fontWeight: 700 }} className="text-light">
                        {thought.username}
                    </span>{" "}
                    thought on {thought.createdAt}
                </p>
                <div className="card-body">
                    <p>{thought.thoughtText}</p>
                </div>
            </div>

            {/* we will not render any reactions if the array is empty, i.e. no reactions */}
            {thought.reactionCount > 0 && (
                <ReactionList reactions={thought.reactions} />
            )}
        </div>
    );
};

export default SingleThought;
