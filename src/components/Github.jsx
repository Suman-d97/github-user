import { GitHub } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const Github = () => {
  const [data, setData] = useState("");
  const [username, setUsername] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //userdata
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      console.log(response?.data);
      setData(response?.data);
      fetchRepoUrl();
    } catch (error) {
      console.log(error.message);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  //star and fork
  const fetchRepoUrl = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      console.log("Url data", response?.data);
      setRepoUrl(response?.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCLick = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Enter user name");
      return;
    }
    fetchData();
  };
  return (
    <>
      <form onSubmit={handleCLick}>
        <Stack sx={{ justifyContent: "center" }} spacing={2} direction="row">
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Search User
          </Button>
        </Stack>
      </form>
      {error && (
        <>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </>
      )}
      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <>
          {data && (
            <>
              <Stack
                sx={{
                  justifyContent: "center",
                  height: "90vh",
                  marginTop: "20px",
                }}
                spacing={2}
                direction="row"
              >
                <Paper sx={{ width: "800px" }} elevation={3}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      marginTop: "2rem",
                    }}
                  >
                    <GitHub fontSize="large" />
                    <Avatar
                      alt="avatar"
                      src={data.avatar_url}
                      sx={{ width: 56, height: 56, marginTop: 3 }}
                    />
                    <h3>{data.name}</h3>
                    <Typography>
                      <strong>Bio</strong> : {data.bio}
                    </Typography>
                    <Typography>
                      <strong>Follower Count</strong> : {data.followers}
                    </Typography>
                    <Typography>
                      <strong>Public Repos</strong> : {data.public_repos}
                    </Typography>

                    {Array.isArray(repoUrl) &&
                      repoUrl.map((value) => {
                        return (
                          <>
                            <ul
                              style={{ listStyleType: "none" }}
                              key={value.id}
                            >
                              <li>
                                <strong>Repo-name</strong> : {value.name}
                              </li>
                              <li>
                                <strong>Repo-link</strong> :{" "}
                                <a target="_blank" href={value.html_url}>
                                  link
                                </a>
                              </li>
                              <li>
                                <strong>Star</strong> : {value.stargazers_count}
                              </li>
                              <li>
                                <strong>Fork</strong> : {value.forks_count}
                              </li>
                            </ul>
                          </>
                        );
                      })}

                    <p></p>
                  </div>
                </Paper>
              </Stack>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Github;
