import React from "react";
import { Link } from "react-router-dom";

// receives 2 props - title, and thoughts array.
const ThoughtList = ({ thoughts, title }) => {
    // if there is no data in the thoughts array, then conditionally render by saying so
    if (!thoughts.length) {
        return <h3>No Thoughts Yet</h3>;
    }

    // if there is data, then we conditionally render and use map function to display all thoughts in array
    return (
        <div>
            <h3>{title}</h3>
            {thoughts &&
                thoughts.map((thought) => (
                    // key prop helps React internally track which data needs to be re-rendered if something changes.
                    <div key={thought._id} className="card mb-3">
                        <p className="card-header">
                            <Link
                                to={`/profile/${thought.username}`}
                                style={{ fontWeight: 700 }}
                                className="text-light"
                            >
                                {thought.username}
                            </Link>{" "}
                            thought on {thought.createdAt}
                        </p>
                        <div className="card-body">
                            <Link to={`/thought/${thought._id}`}>
                                <p>{thought.thoughtText}</p>

                                <p className="mb-0">
                                    Reactions:{thought.reactionCount} || Click
                                    to {thought.reactionCount ? "see" : "start"}{" "}
                                    the discussion!
                                    {/* if there ARE reactions, then SEE the discussion, else START it */}
                                </p>
                            </Link>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ThoughtList;
