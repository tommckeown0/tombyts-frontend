import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Header from "./Header";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

interface Movie {
    title: string;
    path: string;
}

const MoviePlayer: React.FC = () => {
    const { title = "" } = useParams<{ title: string }>(); // Get movie title
    const [movie, setMovie] = useState<Movie | null>(null);
    const { userId, username } = useContext(UserContext);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const token = localStorage.getItem("token");
                const movieResponse = await axios.get(
                    `https://localhost:3001/movies/${encodeURIComponent(
                        title
                    )}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const moviePath = `https://localhost:3001/media/${movieResponse.data.path}`;
                setMovie({ ...movieResponse.data, path: moviePath });

                if (userId) {
                    // Wait for movie data to be set before fetching progress
                    fetchProgress(movieResponse.data.title);
                }
            } catch (error) {
                console.error("Error fetching movie or progress:", error);
            }
        };

        const fetchProgress = async (movieTitle: string) => {
            try {
                const response = await axios.get(
                    `https://localhost:3001/progress/${movieTitle}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                if (response.status === 200 && response.data) {
                    const newProgress = response.data.progress;
                    setProgress(newProgress);

                    // Set video currentTime *only if* the video is ready
                    if (videoRef.current && videoRef.current.readyState > 0) {
                        videoRef.current.currentTime =
                            (newProgress / 100) * videoRef.current.duration;
                    }
                } else {
                    setProgress(0);
                }
            } catch (error) {
                console.error("Error fetching progress", error);
                setProgress(0);
            }
        };

        fetchMovieData();
    }, [title, userId]);

    useEffect(() => {
        const handleProgress = async () => {
            if (videoRef.current && userId && !videoRef.current.paused) {
                const newProgress =
                    (videoRef.current.currentTime / videoRef.current.duration) *
                    100;
                try {
                    await axios.post(
                        `https://localhost:3001/progress/${movie?.title}`,
                        { progress: newProgress },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                        }
                    );
                } catch (error) {
                    console.error("Error updating progress:", error);
                }
            }
        };

        const progressInterval = setInterval(handleProgress, 5000);
        return () => clearInterval(progressInterval);
    }, [userId, movie]); // Include movie in dependency array

    const handleLoadedMetadata = () => {
        if (videoRef.current && progress > 0) {
            videoRef.current.currentTime =
                (progress / 100) * videoRef.current.duration;
        }
    };

    if (!movie)
        return (
            <Container>
                <Header /> {/* Add Header component */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    return (
        <Container>
            <Header />
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {movie.title}
                </Typography>
                {userId && (
                    <Box>
                        <Typography variant="body1">
                            Your User ID {userId}!
                        </Typography>
                        <Typography variant="body1">
                            Your username: {username}
                        </Typography>
                    </Box>
                )}
                <video
                    width="100%"
                    controls
                    ref={videoRef}
                    src={movie?.path}
                    onLoadedMetadata={handleLoadedMetadata}
                >
                    Your browser does not support the video tag.
                </video>
            </Box>
        </Container>
    );
};

export default MoviePlayer;
