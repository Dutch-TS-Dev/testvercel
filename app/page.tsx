"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { atom, useAtom, useSetAtom, useAtomValue } from "jotai";
import { userAtom } from "./useAtoms";
import Ladder from "./components/ladder";
import Join from "./components/join";
import { players } from "./data/players";
import Auth from "./components/registLogin";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

// Define types
interface DatetimeState {
  day: string;
  date: string;
  time: string;
}

interface AppState {
  activeHtml: string;
  pageTitle: string;
  sidebarActive: boolean;
  navActive: boolean;
  searchVisible: boolean;
  searchQuery: string;
  datetime: DatetimeState;
}

// Jotai atoms
const datetimeAtom = atom<DatetimeState>({
  day: "",
  date: "",
  time: "",
});

const activeHtmlAtom = atom<string>("welcome");
const pageTitleAtom = atom<string>("Home");
const sidebarActiveAtom = atom<boolean>(false);
const navActiveAtom = atom<boolean>(false);
const searchVisibleAtom = atom<boolean>(false);
const searchQueryAtom = atom<string>("");

// Function to update date and time
const updateDatetime = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const year = now.getFullYear();
  const dayIndex = now.getDay();
  const monthIndex = now.getMonth();
  let date = now.getDate();
  date = date < 10 ? Number(`0${date}`) : date;

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  let period = "AM";
  if (hours >= 12) {
    period = "PM";
  }

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

  return {
    day: days[dayIndex],
    date: `${months[monthIndex]} ${date}, ${year}`,
    time: `${hours}:${minutesStr}:${secondsStr} ${period}`,
  };
};

const Home = () => {
  // Jotai state hooks
  const [datetime, setDatetime] = useAtom(datetimeAtom);
  const [activeHtml, setActiveHtml] = useAtom(activeHtmlAtom);
  const [pageTitle, setPageTitle] = useAtom(pageTitleAtom);
  const [sidebarActive, setSidebarActive] = useAtom(sidebarActiveAtom);
  const [navActive, setNavActive] = useAtom(navActiveAtom);
  const [searchVisible, setSearchVisible] = useAtom(searchVisibleAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [user, setUser] = useAtom(userAtom);

  // Get authentication state and functions from useAuth
  const { user: authUser, logout } = useAuth();

  // Update the user atom when authUser changes
  useEffect(() => {
    setUser(authUser);
  }, [authUser, setUser]);

  const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);

  // Initialize and update datetime
  useEffect(() => {
    // Initial datetime update
    setDatetime(updateDatetime());

    // Set up interval for clock
    const intervalId = setInterval(() => {
      setDatetime(updateDatetime());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [setDatetime]);

  // Event handlers
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    setNavActive(false);
  };

  const handleNavItemClick = (pageName: string, title: string) => {
    setActiveHtml(pageName || "welcome");
    setPageTitle(title);
    setNavActive(!navActive);
  };

  const handleSideNavClick = (pageName: string, title: string) => {
    setSidebarActive(false);
    setActiveHtml(pageName || "welcome");
    setPageTitle(title);
  };

  const toggleSearch = () => {
    setNavActive(false);
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery !== "" && searchQuery !== null) {
      // Perform search
      setSearchVisible(false);
      setActiveHtml("search");
      setPageTitle("Result");

      // Update the search key element
      const keyElement = document.querySelector(".html.search .key");
      if (keyElement) {
        keyElement.innerHTML = searchQuery;
      }

      setSearchQuery("");
    } else {
      // Just toggle search visibility
      setNavActive(false);
      const searchInput = document.querySelector(".header .search input");
      if (searchInput) {
        (searchInput as HTMLElement).focus();
      }
      setSearchVisible(!searchVisible);
    }
  };

  const toggleNav = () => {
    setNavActive(!navActive);
  };

  // Handle authentication action (Register or Logout)
  const handleAuthAction = async (e: any) => {
    e.preventDefault();

    if (user && user.emailVerified) {
      // User is logged in, handle logout
      const success = await logout();
      if (success) {
        toast.success("Logged out successfully");
        // Force update the user state to ensure UI updates immediately
        setUser(null);
        // Redirect to home after logout
        handleSideNavClick("welcome", "Home");
      }
    } else {
      // User is not logged in, navigate to register
      handleSideNavClick("register", "Register");
    }
  };

  return (
    <div className="mobile-wrap">
      <div className="mobile clearfix">
        <div className="header">
          <span className="ion-ios-navicon pull-left" onClick={toggleSidebar}>
            <i></i>
          </span>
          <span className="title">{pageTitle}</span>
          <span
            className="ion-ios-search pull-right"
            onClick={toggleSearch}
          ></span>
          <div className="search">
            <form method="post" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search Here"
                className={searchVisible ? "search-visible" : ""}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
        </div>
        <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
          <div
            className={`sidebar-overlay ${
              sidebarActive ? "fadeIn animated" : "fadeOut animated"
            }`}
            onClick={toggleSidebar}
          ></div>
          <div className="sidebar-content">
            <div className="top-head">
              {user && user.emailVerified ? (
                <>
                  <div className="name">{user.name}</div>
                  <div className="email">{user.email}</div>
                </>
              ) : (
                <div>
                  Welcome to Pickleball! You need to log in or register.
                </div>
              )}
            </div>

            <div className="nav-left">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("welcome", "Home");
                }}
              >
                <span className="ion-ios-home-outline"></span> Home
              </a>
              {/* <a
                href="#alarm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("alarm", "Alarm");
                }}
              >
                <span className="ion-ios-list-outline"></span> Alarm
              </a> */}
              <a
                href="#join"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("join", "Join");
                }}
              >
                <span className="ion-ios-people-outline"></span> Join
              </a>
              <a
                href="#compose"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("compose", "Compose");
                }}
              >
                <span className="ion-ios-compose-outline"></span> Compose
              </a>
              <a
                href="#ladder"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("ladder", "Ladder");
                }}
              >
                <span className="ion-ios-list-outline"></span> Ladder
              </a>
              <a
                href="#profile"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("profile", "Profile");
                }}
              >
                <span className="ion-ios-person-outline"></span> Profile
              </a>
              <a
                href="#settings"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("settings", "Settings");
                }}
              >
                <span className="ion-ios-gear-outline"></span> Settings
              </a>
              <a
                href="#credits"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("credits", "Credits");
                }}
              >
                <span className="ion-ios-information-outline"></span> Credits
              </a>
              {/* <a
                href="#credits"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("credits", "Credits");
                }}
              >
                <span className="ion-ios-user-outline"></span> Credits
              </a> */}
              {/* <Link href="/register">
                <span className="ion-ios-information-outline"></span> Register
              </Link> */}

              <a
                href={user && user.emailVerified ? "#logout" : "#register"}
                onClick={handleAuthAction}
              >
                <span
                  className={
                    user && user.emailVerified
                      ? "ion-ios-log-out-outline"
                      : "ion-ios-personadd-outline"
                  }
                ></span>
                {user && user.emailVerified ? "Logout" : "Login"}
              </a>
            </div>
          </div>
        </div>
        <div className="content">
          <div
            className={`html search ${
              activeHtml === "search" ? "visible" : ""
            }`}
          >
            <div className="title bounceInDown animated">Search Result</div>
            <p className="flipInX animated">
              Sorry,
              <br />
              no matches found for <b className="key">{searchQuery}</b>
            </p>
          </div>
          <div
            className={`html welcome ${
              activeHtml === "welcome" ? "visible" : ""
            }`}
          >
            <div className="datetime">
              <div className="day lightSpeedIn animated">Pickleball Ladder</div>
              <div className="date lightSpeedIn animated">{datetime.date}</div>
              <div className="time lightSpeedIn animated">{datetime.time}</div>
            </div>
          </div>
          {/* <div
            className={`html alarm ${activeHtml === "alarm" ? "visible" : ""}`}
          >
            <div className="forecast clearfix">
              <div className="datetime pull-left bounceInLeft animated">
                <div className="day">{datetime.day}</div>
                <div className="date">{datetime.date}</div>
              </div>
              <div className="temperature pull-right bounceInRight animated">
                <div className="unit">
                  <span className="ion-ios-sunny-outline"></span> 34<i>&deg;</i>
                </div>
                <div className="location">Kathmandu, Nepal</div>
              </div>
            </div>
            <div className="alarm-list">
              <div className="note clearfix slideInRight animated">
                <div className="time pull-left">
                  <div className="hour">9</div>
                  <div className="shift">AM</div>
                </div>
                <div className="to-do pull-left">
                  <div className="title">Finish HTML Coding</div>
                  <div className="subject">Web UI</div>
                </div>
              </div>
              <div className="note clearfix slideInRight animated">
                <div className="time pull-left">
                  <div className="hour">1</div>
                  <div className="shift">PM</div>
                </div>
                <div className="to-do pull-left">
                  <div className="title">Lunch Break</div>
                  <div className="subject"></div>
                </div>
              </div>
              <div
                className="note clearfix slideInRight animated"
                data-revert="slideOutRight"
              >
                <div className="time pull-left">
                  <div className="hour">3</div>
                  <div className="shift">PM</div>
                </div>
                <div className="to-do pull-left">
                  <div className="title">Design Stand Up</div>
                  <div className="subject">Hangouts</div>
                  <div className="user-list clearfix">
                    <div className="user pull-left">
                      <img src="https://raw.githubusercontent.com/khadkamhn/secret-project/master/img/usr-i.png" />
                    </div>
                    <div className="user pull-left">
                      <img src="https://raw.githubusercontent.com/khadkamhn/secret-project/master/img/usr-ii.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div
            className={`html join ${activeHtml === "join" ? "visible" : ""}`}
          >
            <Join />
          </div>
          <div
            className={`html register ${
              activeHtml === "register" ? "visible" : ""
            }`}
          >
            <Auth />
          </div>
          <div
            className={`html compose ${
              activeHtml === "compose" ? "visible" : ""
            }`}
          >
            <div className="forms">
              <div className="group clearfix slideInRight animated">
                <label className="pull-left" htmlFor="compose-time">
                  <span className="ion-ios-time-outline"></span> Time
                </label>
                <input className="pull-right" id="compose-time" type="time" />
              </div>
              <div className="group clearfix slideInLeft animated">
                <label className="pull-left" htmlFor="compose-date">
                  <span className="ion-ios-calendar-outline"></span> Date
                </label>
                <input className="pull-right" id="compose-date" type="date" />
              </div>
              <div className="group clearfix slideInRight animated">
                <label className="pull-left" htmlFor="compose-title">
                  <span className="ion-ios-paper-outline"></span> Title
                </label>
                <input className="pull-right" id="compose-title" type="text" />
              </div>
              <div className="group clearfix slideInLeft animated">
                <label className="visible" htmlFor="compose-detail">
                  <span className="ion-ios-list-outline"></span> Task
                </label>
                <textarea
                  className="visible"
                  id="compose-detail"
                  rows={3}
                ></textarea>
              </div>
              <div className="action flipInY animated">
                <button className="btn">Compose</button>
              </div>
            </div>
          </div>
          <div
            className={`html ladder ${
              activeHtml === "ladder" ? "visible" : ""
            }`}
          >
            <div className="tabs-list clearfix">
              <a href="#" className="tab active">
                Players
              </a>
              <a href="#" className="tab">
                Messages
              </a>
              <a href="#" className="tab">
                Groups
              </a>
            </div>

            <div className="players">
              {sortedPlayers.map((player) => (
                <Ladder
                  key={player.id}
                  playerImage={player.image}
                  playerName={player.name}
                  playerTeamId={player.teamId}
                  playerRank={player.rank}
                />
              ))}
            </div>
          </div>
          <div
            className={`html settings ${
              activeHtml === "settings" ? "visible" : ""
            }`}
          >
            <div className="setting-list">
              <div className="gear clearfix slideInRight animated">
                <div className="title pull-left">General</div>
                <div className="action pull-right">
                  <span className="ion-ios-arrow-right"></span>
                </div>
              </div>
              <div className="gear clearfix slideInLeft animated">
                <div className="title pull-left">
                  <label htmlFor="gear-notice">Notification</label>
                </div>
                <div className="action pull-right">
                  <input id="gear-notice" className="on-off" type="checkbox" />
                  <label htmlFor="gear-notice"></label>
                </div>
              </div>
              <div className="gear clearfix slideInRight animated">
                <div className="title pull-left">
                  <label htmlFor="gear-sound">Sound</label>
                </div>
                <div className="action pull-right">
                  <input id="gear-sound" className="on-off" type="checkbox" />
                  <label htmlFor="gear-sound"></label>
                </div>
              </div>
              <div className="gear clearfix slideInLeft animated">
                <div className="title pull-left">Theme</div>
                <div className="action pull-right">
                  Standard <span className="ion-ios-arrow-right"></span>
                </div>
              </div>
              <div className="gear clearfix slideInRight animated">
                <div className="title pull-left">Support</div>
                <div className="action pull-right">
                  <span className="ion-ios-arrow-right"></span>
                </div>
              </div>
              <div className="gear clearfix slideInLeft animated">
                <div className="title pull-left">Privacy</div>
                <div className="action pull-right">
                  <span className="ion-ios-arrow-right"></span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`html profile ${
              activeHtml === "profile" ? "visible" : ""
            }`}
          >
            <div className="photo flipInX animated">
              <img src="https://raw.githubusercontent.com/khadkamhn/secret-project/master/img/mohan.png" />
              <div className="social">
                <a
                  href="https://facebook.com/khadkamhn"
                  className="soc-item soc-count-1"
                >
                  <span className="ion-social-facebook"></span>
                </a>
                <a
                  href="https://twitter.com/khadkamhn"
                  className="soc-item soc-count-2"
                >
                  <span className="ion-social-twitter"></span>
                </a>
                <a
                  href="https://github.com/khadkamhn"
                  className="soc-item soc-count-3"
                >
                  <span className="ion-social-github"></span>
                </a>
                <a
                  href="https://pinterest.com/khadkamhn"
                  className="soc-item soc-count-4"
                >
                  <span className="ion-social-pinterest"></span>
                </a>
                <a
                  href="https://np.linkedin.com/in/khadkamhn"
                  className="soc-item soc-count-5"
                >
                  <span className="ion-social-linkedin"></span>
                </a>
                <a
                  href="https://codepen.io/khadkamhn"
                  className="soc-item soc-count-6"
                >
                  <span className="ion-social-codepen"></span>
                </a>
                <a
                  href="skype:khadkamhn?userinfo"
                  className="soc-item soc-count-7"
                >
                  <span className="ion-social-skype"></span>
                </a>
                <a
                  href="http://dribbble.com/khadkamhn"
                  className="soc-item soc-count-8"
                >
                  <span className="ion-social-dribbble"></span>
                </a>
              </div>
            </div>
            <div className="details">
              <p className="heading flipInY animated">
                <span className="name">Mohan Khadka</span>
                <span className="position">Web/Graphic Desiger</span>
              </p>
              <p className="text fadeInUp animated">
                Hi, It's me Mohan from Nepal. I'm a web and graphics designer.
                Designing is my passion and I am still learning and developing
                my skills on graphics designing and coding. I have been working
                on various designing projects.
              </p>
            </div>
          </div>
          <div
            className={`html credits ${
              activeHtml === "credits" ? "visible" : ""
            }`}
          >
            <div className="title flipInY animated">
              I have been using the following assets to build this design
            </div>
            <div className="credit-ol">
              <div className="credit-li lightSpeedIn animated">
                <a
                  href="https://www.google.com/fonts/specimen/Roboto"
                  target="_blank"
                >
                  roboto
                </a>
                <span>for typography</span>
              </div>
              <div className="credit-li lightSpeedIn animated">
                <a href="https://jquery.com" target="_blank">
                  jquery
                </a>
                <span>for design/ui</span>
              </div>
              <div className="credit-li lightSpeedIn animated">
                <a href="http://ionicons.com/" target="_blank">
                  ionicons
                </a>
                <span>for icons</span>
              </div>
              <div className="credit-li lightSpeedIn animated">
                <a href="http://uifaces.com/authorized" target="_blank">
                  ui faces
                </a>
                <span>for avatar</span>
              </div>
              <div className="credit-li lightSpeedIn animated">
                <a
                  href="https://daneden.github.io/animate.css/"
                  target="_blank"
                >
                  animate.css
                </a>
                <span>for animation</span>
              </div>
              <div className="credit-li lightSpeedIn animated">
                <a
                  href="https://dribbble.com/shots/1928064-Secret-Project"
                  target="_blank"
                >
                  concept of design
                </a>
                <span>for layout</span>
              </div>
              <div className="credit-li lightSpeedIn animated">
                <a
                  href="https://unsplash.com/photos/6asyCyR0K1Q/download"
                  target="_blank"
                >
                  unsplash.com
                </a>
                <span>for background</span>
              </div>
            </div>
            <div className="text zoomInUp animated">
              I'm glad for using these resources and expecting same as time
              ahead
            </div>
          </div>
        </div>
        <div className={`nav ${navActive ? "active" : ""}`}>
          <a
            href="#profile"
            className="nav-item nav-count-1"
            onClick={(e) => {
              e.preventDefault();
              handleNavItemClick("profile", "Profile");
            }}
          >
            <i className="ion-ios-person-outline"></i>
            <span className="invisible">Profile</span>
          </a>
          <a
            href="#compose"
            className="nav-item nav-count-2"
            onClick={(e) => {
              e.preventDefault();
              handleNavItemClick("compose", "Compose");
            }}
          >
            <i className="ion-ios-compose-outline"></i>
            <span className="invisible">Compose</span>
          </a>
          <a
            href="#ladder"
            className="nav-item nav-count-3"
            onClick={(e) => {
              e.preventDefault();
              handleNavItemClick("ladder", "Ladder");
            }}
          >
            <i className="ion-ios-chatboxes-outline"></i>
            <span className="invisible">Ladder</span>
          </a>
          {/* <a
            href="#alarm"
            className="nav-item nav-count-4"
            onClick={(e) => {
              e.preventDefault();
              handleNavItemClick("alarm", "Alarm");
            }}
          >
            <i className="ion-ios-alarm-outline"></i>
            <span className="invisible">Alarm</span>
          </a> */}
          <a
            href="#join"
            className="nav-item nav-count-4"
            onClick={(e) => {
              e.preventDefault();
              handleNavItemClick("join", "Join");
            }}
          >
            <i className="ion-ios-people-outline"></i>
            <span className="invisible">Join</span>
          </a>
          <a href="#toggle" className="mask" onClick={toggleNav}>
            <i className="ion-ios-plus-empty"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
