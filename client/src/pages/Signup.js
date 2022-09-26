import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutation";
import Auth from "../utils/auth";

const Signup = () => {
    const [formState, setFormState] = useState({
        username: "",
        email: "",
        password: "",
    });

    // this does not immediately excecute the mutation ADD_USER, as useQuery() would do.
    // this useMutation hook creates and preps a JS function that wraps around mutation code and returns it to us (addUser() function)
    // THIS IS A CLOSURE!
    const [addUser, { error }] = useMutation(ADD_USER);

    // update state based on form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    // submit form, NOTICE THE ASYNC
    // pass data from form state object as vars for our addUser mutation function
    // then we destructure data object from res of mutation and just log it to see if we get the token
    // try/catch code is rly helpful with async code, like Promises.

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // use try/catch instead of promises to handle errors
        try {
            // execute addUser mutation and pass in variable data from form
            const { data } = await addUser({
                variables: { ...formState },
            });

            // when you sign up successfully, you'll be redirected to homepage with token stored in localStorage
            Auth.login(data.addUser.token);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="flex-row justify-center mb-4">
            <div className="col-12 col-md-6">
                <div className="card">
                    <h4 className="card-header">Sign Up</h4>
                    <div className="card-body">
                        <form onSubmit={handleFormSubmit}>
                            <input
                                className="form-input"
                                placeholder="Your username"
                                name="username"
                                type="username"
                                id="username"
                                value={formState.username}
                                onChange={handleChange}
                            />
                            <input
                                className="form-input"
                                placeholder="Your email"
                                name="email"
                                type="email"
                                id="email"
                                value={formState.email}
                                onChange={handleChange}
                            />
                            <input
                                className="form-input"
                                placeholder="******"
                                name="password"
                                type="password"
                                id="password"
                                value={formState.password}
                                onChange={handleChange}
                            />
                            <button className="btn d-block w-100" type="submit">
                                Submit
                            </button>
                        </form>
                        {error && <div>Sign up failed.</div>}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Signup;
