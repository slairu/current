import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Form } from "react-bootstrap";
import NavBar from "../NavBar";
import { Button } from "reactstrap";
import useUser from "../../utils/useUser";
import useGetToken from "../../utils/useGetToken";
import SideBar from "../SideBar";
import UserWrapper from "../userWrapper";
import "./styles/UserSettings.css";

function handleSubmit(token, user, setPfp) {
    
    var profilePictureUrl;

    const profilePicture = new FormData
    profilePicture.append('profilePicture', document.getElementById("pfpForm").files[0])
    console.log(document.getElementById("pfpForm").files[0])
    var username = document.getElementById("usernameForm").value;
    var phoneNumber = document.getElementById("phoneNumberForm").value;
    var bio = document.getElementById("bioForm").value;
    var status = document.getElementById("statusForm").value;
    
    if(username) {
        const response = fetch("http://localhost:4200/api/v1/users/" + user._id + "/username", {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify({ username: username }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }).then((res) => console.log(res));
    }

    if(phoneNumber) {
        const response = fetch("http://localhost:4200/api/v1/users/" + user._id + "/phoneNumber", {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify({ phoneNumber: phoneNumber }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        }).then((res) => console.log(res));
    }
    
    if(bio) {
        const response = fetch("http://localhost:4200/api/v1/users/" + user._id + "/bio", {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify({ bio: bio }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
              }
            })
            .then((res) => console.log(res));
        }

    if(status) {
        const response = fetch("http://localhost:4200/api/v1/users/" + user._id + "/status", {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify({ status: status }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
              }
            })
            .then((res) => console.log(res));
        }

    if(document.getElementById("pfpForm").files[0]) {
        const response = fetch("http://localhost:4200/api/v1/users/" + user._id + "/profilePicture", {
        method: "PUT",
        mode: "cors",
        body: profilePicture,
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then((res) => {
            console.log(res)
            const response = fetch("http://localhost:4200/api/v1/users/" + user._id, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then((res) => res.json())
            .then((data) => setPfp(data.profilePicture));
        });
    }

    return profilePictureUrl;

}

function getProfilePicture(token, user, setPfp) {
    const userId = user._id;
        async function fetchUser() {
            fetch(`http://localhost:4200/api/v1/users/${userId}`)
             .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
                })
                .then(data => {
                    setPfp(data.profilePicture);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
            }
}

function UserSettings(prop) {

    const user  = useUser();
    const token = useGetToken();

    const [pfp, setPfp] = useState(null)
    const [username, setUsername] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [bio, setBio] = useState(null)
    const [email, setEmail] = useState(null)

    useEffect(() => {
        if (!user) { return }
        const userId = user._id;
        async function fetchUser() {
            fetch(`http://localhost:4200/api/v1/users/${userId}`)
             .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
                })
                .then(data => {
                    console.log(data)
                    setPfp(data.profilePicture);
                    setUsername(data.username);
                    setPhoneNumber(data.phoneNumber);
                    setBio(data.bio);
                    setEmail(data.email);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
            }
        fetchUser()    
    }, [user])
    
    return (
        <UserWrapper user={user}>
        <div className="Wrapper">
            <SideBar />
            <div className="SettingsContainer">
            <header>
                <div className='p-5 text-center'>
                    <h1 className='mb-4'>Account Settings</h1>
                </div>
            </header>
            <Row>
                <Col md={2}
                    style={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "left"
                }}>
                </Col>
                <Col md={5}
                style={{
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "left"
                }}>
                    <img
                    src={pfp}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width="80"
                    />
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <Form>
                        <Form.Group controlId="pfpForm" className="mb-3">
                            <Form.Label>New Profile Picture</Form.Label>
                            <Form.Control type="file" accept="image/png, image/jpeg"/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col 
                    style={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "left"
                    }}>
                </Col>
                <p></p>
            </Row>
            <Row>
                <Col md={2}
                    style={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "left"
                }}>
                </Col>
                <Col md={4}
                style={{
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "left"
                }}>
                    <div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="controlInput1">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder={email} disabled readOnly/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="usernameForm">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder={username}/>
                            </Form.Group>
                        </Form>
                        <p></p>
                    </div>
                </Col>
                <Col md={5}
                    style={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "left"
                    }}>
                    <div>
                        <Form>
                            <Form.Group className="mb-3" controlId="phoneNumberForm">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" placeholder={phoneNumber}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="statusForm">
                                <Form.Label>Status</Form.Label>
                                <Form.Select>
                                    <option>online</option>
                                    <option>offline</option>
                                    <option>away</option>
                                    <option>busy</option>
                                    <option>do not disturb</option>
                                    <option>invisible</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                        <p></p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={2}
                    style={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "left"
                }}>
                </Col>
                <Col md={4}
                    style={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "left"
                    }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="bioForm">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={bio}/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={5}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left"
                    }}>
                    <Button onClick={() => {
                        handleSubmit(token, user, setPfp)
                        if(document.getElementById("usernameForm").value)
                            setUsername(document.getElementById("usernameForm").value)
                        if(document.getElementById("phoneNumberForm").value)
                            setPhoneNumber(document.getElementById("phoneNumberForm").value)
                        if(document.getElementById("bioForm").value)
                            setBio(document.getElementById("bioForm").value)
                    }}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </div>
        </div>
        </UserWrapper>
    );
}

export default UserSettings;