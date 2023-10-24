import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../views/current-name.png";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  function goToLink(link) {
    window.location = link;
  }

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md" container={false}>
        <NavbarBrand className="logo" />
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                tag={RouterNavLink}
                to="/"
                exact
                activeClassName="router-link-exact-active"
              ></NavLink>
            </NavItem>
            <img src={logo} alt="logo" className="logo2" />
            <ul>
              <li>
                <NavLink to="/about-us" end>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact">Our Products</NavLink>
              </li>
              <li>
                <NavLink to="/blog">Use Cases</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to="/chat"
                      onClick={() => {
                        goToLink("http://localhost:3000/chat");
                      }}
                    >
                      Group Chat
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/calendar"
                      onClick={() => {
                        goToLink("http://localhost:3000/calendar");
                      }}
                    >
                      Your Schedule
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </Nav>
          <Nav className="b" navbar>
            {!isAuthenticated && (
              <NavItem>
                <Button
                  id="qsLoginBtn"
                  className="b"
                  onClick={() => loginWithRedirect()}
                >
                  Log in
                </Button>
              </NavItem>
            )}
            {isAuthenticated && (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret id="profileDropDown">
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width="50"
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>{user.name}</DropdownItem>
                  <DropdownItem
                    tag={RouterNavLink}
                    to="/profile"
                    className="dropdown-profile"
                    activeClassName="router-link-exact-active"
                  >
                    <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                  </DropdownItem>
                  <DropdownItem
                    tag={RouterNavLink}
                    to="/user-settings"
                    className="dropdown-user-settings"
                    activeClassName="router-link-exact-active"
                  >
                    {" "}
                    User Settings
                  </DropdownItem>
                  <DropdownItem
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                    out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
