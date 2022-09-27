import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../../utils/mutation";
import { QUERY_THOUGHTS, QUERY_ME } from "../../utils/queries";

export default function ThoughtForm() {
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        // below, addThought reps the new thought that was just created
        // using cache object, we can read what's currently saved in QUERY_THOUGHTS cache and then update it with writeQuery to include new thought object
        update(cache, { data: { addThought } }) {
            // read what's currently in the cache, COULD NOT EXIST YET so wrap in try/catch

            try {
                // update me array's cache
                const { me } = cache.readQuery({ query: QUERY_ME });
                cache.writeQuery({
                    query: QUERY_ME,
                    data: {
                        me: { ...me, thoughts: [...me.thoughts, addThought] },
                    },
                });
            } catch (err) {
                console.warn("First thought insertion by user!");
            }

            // update thought array's cache
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
            // prepend the newest thought to the front of the array
            cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: { thoughts: [addThought, ...thoughts] },
            });
        },
    });

    const [thoughtText, setText] = useState("");
    const [characterCount, setCharacterCount] = useState(0);

    const handleChange = (event) => {
        event.preventDefault();

        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            // add thought to db
            await addThought({
                variables: { thoughtText },
            });
            // clear form value
            setText("");
            setCharacterCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
                Character Count:{characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>

            <form
                className="flew-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}
