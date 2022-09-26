import React from "react";

import { useQuery } from "@apollo/client"; //hook from AC
// will allow us to make requests to the graphQL server we connected to and made available to the app using the Apollo Provider component from App.js

// we can use this query with the hook functionality above ^ and query thought data!
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";
import Auth from "../utils/auth";

import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";

const Home = () => {
    const loggedIn = Auth.loggedIn();

    // use useQuery hook to make query request
    const { loading, data } = useQuery(QUERY_THOUGHTS);
    // use object destructuring to extract data fom useQuery hooks res and rename it userData so it's more descriptive
    const { data: userData } = useQuery(QUERY_ME_BASIC);
    // now, if user is logged in and has valid token, userData will hold all of returned info from query

    // loading property indicates that the request isnt done just yet; when it's finished, and data returned from server, then
    // that info is stored in destructured data property
    // loading property allows us to conditionally render data based on whether or not there is data to even display

    const thoughts = data?.thoughts || [];
    // if data exists, store in thoughts constant we just created. If data is undefined (oesnt exist until query to server is finished), then save empty array
    console.log(thoughts);
    return (
        <main>
            <div className="flex-row justify-space-between">
                {/* creates a 2 col layout IF user is logged in */}
                <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
                    {/* if data is still loading (i.e. loading is DEFINED), then indicate so with "loading" div. ELSE, display ThoughtList component with appropriate props */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ThoughtList
                            thoughts={thoughts}
                            title="Some Feed for Thought(s)..."
                        ></ThoughtList>
                    )}
                </div>

                {/* If loggedIn ===TRUE and there IS userData, then FriendList component will load */}
                {loggedIn && userData ? (
                    <div className="col-12 col-lg-3 mb-3">
                        <FriendList
                            username={userData.me.username}
                            friendCount={userData.me.friendCount}
                            friends={userData.me.friends}
                        />
                    </div>
                ) : null}
            </div>
        </main>
    );
};

export default Home;
