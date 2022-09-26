// pass 3 props to FriendList - username whose friends these belong to, friend count, and actual array of friends
// that way either message that there is NO friends, or map friends into linkable elements

import React from "react";
import { Link } from "react-router-dom";

export default function FriendList({ friendCount, username, friends }) {
    if (!friends || !friends.length) {
        return (
            <p className="bg-dark text-list p-3">
                {username}, make some friends!
            </p>
        );
    }
    return (
        <div>
            <h5>
                {/* if there's 1 friend, then use correct casing--ELSE (which means >1), use correct casing */}
                {username}'s {friendCount}{" "}
                {friendCount === 1 ? "friend" : "friends"}
            </h5>
            {friends.map((friend) => (
                <button
                    className="btn w-100 display-block mb-2"
                    key={friend._id}
                >
                    <Link to={`/profile/${friend.username}`}>
                        {friend.username}
                    </Link>
                </button>
            ))}
        </div>
    );
}
