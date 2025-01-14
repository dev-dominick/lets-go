// Import React framework and destructure `useState`
import React, { useState } from "react";

// Import the `useMutation()` hook from Apollo Client
import { useMutation } from "@apollo/client";

// Import Material UI components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

// Reference required mutation for logging in a user
import { CREATE_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const SignupForm = () => {
    // State for logging in
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Assign the CREATE_USER mutation to `createUser` and capture any errors returned
    const [createUser, { error }] = useMutation(CREATE_USER);

    // Handling state change of sign up form
    let handleChange = (e) => {
        if (e.target.id === "usernameID") {
            setUsername(e.target.value);
        } else if (e.target.id === "passwordID") {
            setPassword(e.target.value);
        } else if (e.target.id === "emailID") {
            setEmail(e.target.value);
        }
    };

    // this submit is ref to sign up button,
    let handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            // Spread `userFormData` into `createUser` and return context data about the user for the subsequent login function
            const { data } = await createUser({
                variables: {
                    username: username,
                    email: email,
                    password: password,
                },
            });
            // Store the token to local storage. (`login` refers to the typesDefs mutation)
            Auth.login(data.createUser.token);
        } catch (err) {
            console.error(err);
            // TODO If error in login, then show alert
        }

        // Reset login form data
        setUsername({ username: "" });
        setEmail({ email: "" });
        setPassword({ password: "" });
    };

    return (
        <>
            <Fade in={true}>
                <Box sx={style} component="form" onSubmit={handleSubmit}>
                    <Stack
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            "& > :not(style)": { m: 1 },
                        }}
                    >
                        <h3>Welcome To Let's Go</h3>
                        {/* username or email */}
                        <TextField helperText="Please select a username " id="usernameID" label="Username" value={username} onChange={handleChange} required />

                        <TextField helperText="Please enter an email" id="emailID" label="Email" value={email} onChange={handleChange} required />
                        {/* password */}
                        <TextField helperText="Please select a password" id="passwordID" label="Password" type="password" value={password} onChange={handleChange} required />

                        <Button variant="outlined" type="submit">
                            Sign Up
                        </Button>

                        {username}
                    </Stack>
                </Box>
            </Fade>
        </>
    );
};

export default SignupForm;
