import React from "react";

import { useParams, Navigate } from "react-router-dom";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import ThoughtForm from "../components/ThoughtForm";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { ADD_FRIEND } from "../utils/mutation";

const Profile = () => {
    const { username: userParam } = useParams(); //retrieves username from URL, passes it to useQuery
    const [addFriend] = useMutation(ADD_FRIEND);

    // If there is a userParam value that we got from URL bar, we'll use that value to run QUERY_USER
    // if there's no value in userParam, if we just visit /profile as a loggedIn user, we'll run QUERY_ME instead
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam },
    });

    // QUERY_ME - res will return our data in me property
    // QUERY_USER - res will return our data in user property
    const user = data?.me || data?.user || {};

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(Auth.getProfile().data.username);
    console.log(userParam);

    // navigate to personal profile page if username is the logged-in user's
    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/profile" />;
    }

    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this page. Use the navigation
                links above to sign up or log in!
            </h4>
        );
    }

    const handleClick = async () => {
        try {
            await addFriend({
                variables: { id: user._id },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex-row mb-3">
                <h2 className="bg-dark text-secondary p-3 display-inline-block">
                    Viewing {userParam ? `${user.username}'s` : "your"} profile.
                </h2>

                {userParam && (
                    <button className="btn ml-auto" onClick={handleClick}>
                        Add Friend
                    </button>
                )}
            </div>

            <div className="flex-row justify-space-between mb-3">
                <div className="col-12 mb-3 col-lg-8">
                    {/* props passed to ThoughtList to render a list of thoughts unique to this user */}
                    <ThoughtList
                        thoughts={user.thoughts}
                        title={`${user.username}'s thoughts...`}
                    />
                </div>

                <div className="col-12 col-lg-3 mb-3">
                    <FriendList
                        username={user.username}
                        friendCount={user.friendCount}
                        friends={user.friends}
                    />
                </div>
            </div>

            <div className="mb-3">{!userParam && <ThoughtForm />}</div>
        </div>
    );
};

export default Profile;
