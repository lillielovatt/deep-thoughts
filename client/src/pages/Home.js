import React from "react";

import { useQuery } from "@apollo/client"; //hook from AC
// will allow us to make requests to the graphQL server we connected to and made available to the app using the Apollo Provider component from App.js

// we can use this query with the hook functionality above ^ and query thought data!
import { QUERY_THOUGHTS } from "../utils/queries";

import ThoughtList from "../components/ThoughtList";

const Home = () => {
    // use useQuery hook to make query request
    const { loading, data } = useQuery(QUERY_THOUGHTS);

    // loading property indicates that the request isnt done just yet; when it's finished, and data returned from server, then
    // that info is stored in destructured data property
    // loading property allows us to conditionally render data based on whether or not there is data to even display

    const thoughts = data?.thoughts || [];
    // if data exists, store in thoughts constant we just created. If data is undefined (oesnt exist until query to server is finished), then save empty array
    console.log(thoughts);
    return (
        <main>
            <div className="flex-row justify-space-between">
                <div className="col-12 mb-3">
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
            </div>
        </main>
    );
};

export default Home;
