import React, { Fragment, useEffect, useState } from "react";

import Hero from "../components/Hero";
import Content from "../components/Content";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import "./Home.css";
import logoW from "./current-yo.png"; // Adjust the path if necessary
import logo from "./current-name.png"; // Adjust the path if necessary
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "./Carousel";
import {
  faComments,
  faCalendarAlt,
  faVideo,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import "./styles/X.css";
// import logoW from "./current-yo.png"; // Adjust the path if necessary
// import logo from "./current-name.png"; // Adjust the path if necessary
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Carousel from "./Carousel";

const teamMembers = [
  {
    name: "Chealsea Chan",
    image:
      "https://media.licdn.com/dms/image/D5603AQHUSXbtl9BjsA/profile-displayphoto-shrink_800_800/0/1687912936356?e=2147483647&v=beta&t=q7324eekOQAezdJCGlM9WWZlHfrgPfpGEsIac3xPi7U", // Replace with actual image URL or path
  },
  {
    name: "Sarah Liu",
    image:
      "https://media.licdn.com/dms/image/D5603AQHUSXbtl9BjsA/profile-displayphoto-shrink_800_800/0/1687912936356?e=2147483647&v=beta&t=q7324eekOQAezdJCGlM9WWZlHfrgPfpGEsIac3xPi7U", // Replace with actual image URL or path
  },
  {
    name: "Victor Hurst",
    image:
      "https://media.licdn.com/dms/image/D5603AQEt_vPx_3IGyg/profile-displayphoto-shrink_800_800/0/1674696242814?e=2147483647&v=beta&t=hS8CzmocahrPNSygIKoQIDxAgVnbImCzrXeEgkYcAss", // Replace with actual image URL or path
  },
  {
    name: "Divyansh Kachchhava",
    image:
      "https://media.licdn.com/dms/image/D5603AQHUSXbtl9BjsA/profile-displayphoto-shrink_800_800/0/1687912936356?e=2147483647&v=beta&t=q7324eekOQAezdJCGlM9WWZlHfrgPfpGEsIac3xPi7U", // Replace with actual image URL or path
  },
  {
    name: "Matthew Snelgrove",
    image:
      "https://media.licdn.com/dms/image/C5603AQEcwtqnUi58eQ/profile-displayphoto-shrink_800_800/0/1663547131007?e=2147483647&v=beta&t=4oeSUUredWnkaSvE0nd9DxRSEZ8_fSWpsedsvMPcrQ8",
  },
  {
    name: "Jeferry He",
    image:
      "https://media.licdn.com/dms/image/D5603AQHUSXbtl9BjsA/profile-displayphoto-shrink_800_800/0/1687912936356?e=2147483647&v=beta&t=q7324eekOQAezdJCGlM9WWZlHfrgPfpGEsIac3xPi7U", // Replace with actual image URL or path
  },
  {
    name: "Shamder Hassen Zehi",
    image:
      "https://media.licdn.com/dms/image/D5603AQHUSXbtl9BjsA/profile-displayphoto-shrink_800_800/0/1687912936356?e=2147483647&v=beta&t=q7324eekOQAezdJCGlM9WWZlHfrgPfpGEsIac3xPi7U", // Replace with actual image URL or path
  },
  // Add other team members similarly
];
const carouselData = [
  {
    title: "Professional Meetings",
    description1:
      "Remote teams, like Mark, the software developer working for a tech startup, benefit immensely from our remote collaboration service...",
    description2:
      "Beyond video conferencing, our platform includes shared calendars that allow remote team members to coordinate schedules...",
  },
  {
    title: "Personal Communication",
    description1:
      "Our video conferencing web app is not just limited to professional use; it caters to personal communication needs as well...",
    description2:
      "Lisa can use the app for video calls to catch up with her loved ones, plan virtual events, and celebrate special occasions together...",
  },
  // Add more data objects if you have more slides
];

const settings2 = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: (
    <button type="button" className="slick-prev">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  ),
  nextArrow: (
    <button type="button" className="slick-next">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  ),
};
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const content = [
  {
    title: "Professional Meetings",
    text: "For professionals like Sarah, our platform offers a reliable video conferencing solution integrated with shared calendars and messaging. Sarah can schedule and join video conferences with team members, clients, or partners.",
  },
  {
    title: "Remote Collaboration",
    text: "For remote workers like Mark, our platform provides a seamless way to connect with team members, join video calls, and share calendar availability. Real-time messaging features keep discussions ongoing, making remote collaboration efficient and productive.",
  },
  {
    title: "Bicode Calling",
    text: "With our platform's built-in Bicode Calling, users can enjoy encrypted and secure voice calls with end-to-end encryption. Whether it's for business or personal communication, Bicode Calling ensures privacy and confidentiality.",
  },
  {
    title: "Schedule Organizer",
    text: "Our chat application comes with a powerful Schedule Organizer feature that enables users to plan, manage, and sync their schedules effortlessly. Whether it's personal events or business meetings, the Schedule Organizer ensures everyone stays on the same page.",
  },
  {
    title: "File Sharing",
    text: "Sharing files is a breeze with our chat application. Users can easily exchange documents, images, videos, and more directly through the platform. Say goodbye to email attachments and enjoy seamless file sharing.",
  },
  {
    title: "Smart Notifications",
    text: "Never miss an important message or event with our Smart Notifications. Users can customize notification settings to receive alerts for specific keywords, mentions, or upcoming scheduled activities.",
  },
];

const content2 = [
  {
    title: "Real-time Chatting",
    text: "Stay connected with friends and colleagues through our real-time chatting feature. Send instant messages, emojis, and multimedia to express yourself and collaborate effectively.",
  },
  {
    title: "High-quality Video Calling",
    text: "Experience crystal-clear video calls with our high-quality video calling feature. Connect with individuals or groups, share screens, and collaborate seamlessly regardless of your location.",
  },
  {
    title: "Smart Scheduling",
    text: "Our smart scheduling tool makes planning events and meetings effortless. View the availability of attendees, send out invitations, and receive RSVPs, all in one place.",
  },
  {
    title: "File Sharing",
    text: "Share documents, images, and files of any size easily with our integrated file sharing feature. Collaborate on projects by accessing shared files in real-time.",
  },
  {
    title: "End-to-End Encryption",
    text: "Ensure your conversations and data are secure with our end-to-end encryption. Your privacy is our top priority, making sure your communications remain confidential.",
  },
  {
    title: "User-friendly Interface",
    text: "Our application boasts a user-friendly interface, making it easy for anyone to navigate and use. Enjoy a seamless experience with intuitive features and smooth interactions.",
  },
  {
    title: "Cross-platform Support",
    text: "Access our application from anywhere with cross-platform support. Whether on desktop, mobile, or web, stay connected on all your devices.",
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const Home = () => {
  return (
    <div className="home-page-css">
      <NavBar className="wed" />

      <div className="home-container">
        <div></div>
        <div className="x">
          <div className="left-section">
            <h1>Current Chatting Applicaton</h1>
            <p>Empowering Conversations, Anytime, Anywhere!</p>
            <br />
            <button className="b">Get Started </button>
          </div>
          <div className="right-section4">
            <img src={logoW} alt="OutChatting" className="xx" />
          </div>
        </div>

        <div className="about-us">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-description">
            At Current, we believe that communication is the key to building
            meaningful relationships. Our mission is to empower people to
            connect with each other, regardless of distance or location. We
            strive to create a platform that fosters seamless communication and
            collaboration in today's fast-paced world, where staying connected
            is more crucial than ever before
          </p>
        </div>
        <h2 className="section-title">What we provide</h2>

        <div className="features">
          <div className="feature">
            <img
              src="https://cdn.dribbble.com/users/1708816/screenshots/15637339/media/2ea4a194c3149189c2507d137f81a652.gif"
              alt="Video Conferencing"
            />
            <h4>Video Conferencing</h4>
            <p>
              Stay connected with high-quality video and audio calls for
              face-to-face interactions anytime, anywhere with anyone
            </p>
          </div>
          <div className="feature">
            <img
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHB3b2V2bjFuZzc0MWx4MnYwZmEwNnZhYzlxd2NhejA1cnVjZzBybiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgHb75OMPtN8u6A/giphy.gif"
              alt="Shared Calendars"
            />
            <h4>Shared Calendars</h4>
            <p>
              Effortlessly manage schedules with shared calendars, coordinating
              meetings and events while receiving timely notifications
            </p>
          </div>
          <div className="feature">
            <img
              src="https://cdn.dribbble.com/users/873034/screenshots/8501767/media/714768920d7cbbce7f60133d5c2b49ce.gif"
              alt="Real-Time Messaging"
            />
            <h4>Real-Time Messaging</h4>
            <p>
              Engage in real-time conversations with other participants during
              video calls or through private messaging
            </p>
          </div>
        </div>
        <h2 className="section-title">Why Current</h2>
        <Carousel content={content} />

        <div className="about-us">
          <h2 className="section-title">Business Model</h2>
          <p className="section-description">
            At our core, we operate on a subscription-based model that allows
            users to access the full range of features across all our products.
            We offer flexible pricing plans tailored to individual needs,
            ensuring our services are accessible to individuals, businesses, and
            organizations alike. Additionally, we provide a free tier that
            includes essential functionalities, giving users a taste of our
            products before committing to a subscription.
          </p>
        </div>
        <h2 className="section-title">Our Products</h2>

        <div className="features">
          <div className="feature">
            <img
              src="https://s3-alpha.figma.com/hub/file/408830524/c98e3200-42db-4c7f-b7cd-225875e0af3a-cover"
              alt="Video Conferencing"
            />
            <h4>Chatting Application</h4>
            <p>
              Stay connected with high-quality video and audio calls for
              face-to-face interactions anytime, anywhere with anyone
            </p>
          </div>
          <div className="feature">
            <img
              src="https://cdn.dribbble.com/userupload/4736446/file/original-465845171899d9e425d3b2207c00ef7d.png?resize=400x0"
              alt="Shared Calendars"
            />
            <h4>Schedule Manager</h4>
            <p>
              Effortlessly manage schedules with shared calendars, coordinating
              meetings and events while receiving timely notifications
            </p>
          </div>
          <div className="feature">
            <img
              src="https://storage.googleapis.com/live-connect/teleport/assets/0.4/images/website/teleport-app-ui-mobile-img.png"
              alt="Real-Time Messaging"
            />
            <h4>Video Calling</h4>
            <p>
              Engage in real-time conversations with other participants during
              video calls or through private messaging
            </p>
          </div>
        </div>
        <div className="about-us">
          <h2 className="section-title">About us</h2>
          {/* <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <img
                  src={member.image}
                  alt={member.name}
                  className="profile-image"
                />
                <p className="name">{member.name}</p>
              </div>
            ))}
          </div> */}
          <p className="section-description">
            We are a team of 7 Computer Science students at the University of
            Toronto Scarborough. Our passion for technology and innovation led
            us to create this cutting-edge application to revolutionize
            communication and collaboration. Through our skills and
            determination, we crafted an intuitive and efficient platform for
            users to seamlessly interact and share ideas.
          </p>
        </div>
        <h2 className="section-title">Use cases</h2>
        <Carousel content={content2} />

        <div className="cta-section">
          <h2>Join us on this exciting journey!</h2>
          <div className="left-section"></div>
          <img
            src="https://thumbs.gfycat.com/QuarterlyThirdBlacklab-max-1mb.gif"
            alt="logo"
            className="logo4"
          />
          <p>
            As we bring people closer together through our Video Conferencing
            Web App. Together, we'll redefine communication in personal and
            professional spaces, making connections stronger and more meaningful
            than ever before.
          </p>
          <Link to="/signup" className="cta-btn">
            Get Started
          </Link>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-info">
            <p>
              &copy; 2023 <strong>Current </strong>
              <br></br>
              All Rights Reserved
              <br></br>
            </p>
            <p>
              Built with{" "}
              <a
                href="https://www.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                OutChatting Framework
              </a>
            </p>
            <p>
              Contact us:{" "}
              <a href="mailto:contact@outchatting.com">
                contact@outchatting.com
              </a>
            </p>
          </div>
          <div className="footer-sections">
            <div className="footer-section">
              <h3>Products</h3>
              <ul>
                <li>
                  <a href="/product-1">Chatting Application</a>
                </li>
                <li>
                  <a href="/product-2">Scheduling</a>
                </li>
                <li>
                  <a href="/product-3">Video Calling</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Use Cases</h3>
              <ul>
                <li>
                  <a href="/use-case-1">Remote Teams</a>
                </li>
                <li>
                  <a href="/use-case-2">Social Connections</a>
                </li>
                <li>
                  <a href="/use-case-3">Collaboration</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>About</h3>
              <ul>
                <li>
                  <a href="/about-us">About Us</a>
                </li>
                <li>
                  <a href="/team">Our Team</a>
                </li>
                <li>
                  <a href="/careers">Careers</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
const X = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Step 2: Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  return (
    <Router>
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        {/* Navigation Bar */}

        <nav className="navbar">
          <img alt="logo" className="logo2" />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about-us">Services</Link>
            </li>
            <li>
              <Link to="/contact">Our Products</Link>
            </li>
            <li>
              <Link to="/blog">Use Cases</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/blog">
                <button className="b">Login</button>
              </Link>
            </li>
          </ul>
        </nav>
        <Home />
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-info">
              <p>
                &copy; 2023 <strong>Current </strong>
                <br></br>
                All Rights Reserved
                <br></br>
              </p>
              <p>
                Built with{" "}
                <a
                  href="https://www.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OutChatting Framework
                </a>
              </p>
              <p>
                Contact us:{" "}
                <a href="mailto:contact@outchatting.com">
                  contact@outchatting.com
                </a>
              </p>
            </div>
            <div className="footer-sections">
              <div className="footer-section">
                <h3>Products</h3>
                <ul>
                  <li>
                    <a href="/product-1">Chatting Application</a>
                  </li>
                  <li>
                    <a href="/product-2">Scheduling</a>
                  </li>
                  <li>
                    <a href="/product-3">Video Calling</a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h3>Use Cases</h3>
                <ul>
                  <li>
                    <a href="/use-case-1">Remote Teams</a>
                  </li>
                  <li>
                    <a href="/use-case-2">Social Connections</a>
                  </li>
                  <li>
                    <a href="/use-case-3">Collaboration</a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h3>About</h3>
                <ul>
                  <li>
                    <a href="/about-us">About Us</a>
                  </li>
                  <li>
                    <a href="/team">Our Team</a>
                  </li>
                  <li>
                    <a href="/careers">Careers</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default Home;
