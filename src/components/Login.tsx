import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Link,
} from "@mui/material";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const server_url = process.env.REACT_APP_SERVER_URL;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await axios.post(`${server_url}/auth/login`, {
				username,
				password,
			});

			if (res.status === 200) {
				// Extract the token from the response
				const token = res.data.token;

				// Store the token in localStorage
				localStorage.setItem("token", token); // Or use sessionStorage

				// Redirect to the main page
				window.location.href = "/movieslist"; // Replace "/" with the actual path of your main page
			} else {
				// Handle unsuccessful login (e.g., show an error message)
				console.error("Login failed:", res.data.message);
			}
		} catch (err) {
			console.error("Login error:", err);
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
				<Button
					component={RouterLink}
					to="/"
					variant="contained"
					color="primary"
				>
					Home
				</Button>
			</Box>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				data-testid="login-title"
			>
				Login
			</Typography>
			<form onSubmit={handleSubmit}>
				<Box sx={{ mb: 2 }}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						inputProps={{ "data-testid": "username-input" }}
					/>
				</Box>
				<Box sx={{ mb: 2 }}>
					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						inputProps={{ "data-testid": "password-input" }}
					/>
				</Box>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					data-testid="login-submit-button"
				>
					Login
				</Button>
			</form>
		</Container>
	);
};

export default Login;
