"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { userAtom } from "./useAtoms";
import LadderRow from "./components/ladderRow";

import { teams } from "./data/dummy";
import Auth from "./components/Auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { currentViewAtom, ViewType } from "@/app/viewAtoms";
import RoundsViewer from "./components/Viewer";
import { ScrollToBottomArrow } from "./components/ScrollDown";
import Join from "./components/JoinLeague";
import Info from "./components/Info";

// Define types
interface DatetimeState {
  day: string;
  date: string;
  time: string;
}

const activeHtmlAtom = atom<string>("ladder");
const pageTitleAtom = atom<string>("Ladder");
const sidebarActiveAtom = atom<boolean>(false);
const navActiveAtom = atom<boolean>(false);
const searchVisibleAtom = atom<boolean>(false);
const searchQueryAtom = atom<string>("");

const Home = () => {
  // Jotai state hooks

  const [activeHtml, setActiveHtml] = useAtom(activeHtmlAtom);
  const [pageTitle, setPageTitle] = useAtom(pageTitleAtom);
  const [sidebarActive, setSidebarActive] = useAtom(sidebarActiveAtom);
  const [navActive, setNavActive] = useAtom(navActiveAtom);
  const [searchVisible, setSearchVisible] = useAtom(searchVisibleAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [user, setUser] = useAtom(userAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  // Get authentication state and functions from useAuth
  const { logout } = useAuth();

  useEffect(() => {
    const newTitle = {
      // welcome: 'Home',
      join: "Join",
      auth: "Sign in",
      ladder: "Ladder",
      profile: "Profile",
      matches: "Matches",
    }[currentView];

    if (newTitle) setPageTitle(newTitle);
  }, [currentView]);

  useEffect(() => {
    // Always keep activeHtml in sync with currentView
    if (currentView !== activeHtml) {
      setActiveHtml(currentView);
    }
  }, [activeHtml, currentView, setActiveHtml]);

  // Event handlers
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    setNavActive(false);
  };

  const handleSideNavClick = (pageName: string, title: string) => {
    setSidebarActive(false);
    setActiveHtml(pageName || "welcome");
    setCurrentView(pageName as ViewType);
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
        // setUser(null);
        setUser({
          id: "",
          name: "",
          age: 0,
          email: "",
        });
        // Redirect to home after logout
        handleSideNavClick("ladder", "Ladder");
      }
    } else {
      // User is not logged in, navigate to register
      handleSideNavClick("register", "Register");
    }
  };

  return (
    <div className={`mobile-wrap relative`}>
      {/* <div className={`mobile-wrap relative ${getRandomPosition()}`}> */}
      {/* <div className={`mobile-wrap relative right-[${getRandomPosition()}px] `}> */}
      {/* <div className="mobile-wrap"> */}
      <div className="mobile clearfix overflow-scroll">
        <div className="header">
          <span
            className="cursor-pointer ion-ios-navicon pull-left"
            onClick={toggleSidebar}
          >
            <i></i>
          </span>
          <span className="title">{pageTitle}</span>
          {/* <span
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
          </div> */}
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
                <div className="small-info-text mb-4">
                  Welcome to Leaqx!
                  <br /> You need to Login or Register.
                </div>
              )}
            </div>

            <div className="nav-left">
              <a
                href="#ladder"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("ladder", "Ladder");
                }}
              >
                <span className="ion-ios-list-outline"></span> Ladder
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
                href="#matches"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("matches", "Matches");
                }}
              >
                <span className="ion-ios-people-outline"></span> Matches
              </a>
              {/* <a
                href="#compose"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("compose", "Compose");
                }}
              >
                <span className="ion-ios-compose-outline"></span> Compose
              </a> */}
              {/* <a
                href="#profile"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("profile", "Profile");
                }}
              >
                <span className="ion-ios-person-outline"></span> Profile
              </a> */}
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
                href="#information"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("information", "Information");
                }}
              >
                <span className="ion-ios-information-outline"></span>{" "}
                Information
              </a>
              {/* <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("login", "Login");
                }}
              >
                <span className="ion-ios-unlocked-outline"></span> Login
              </a>
              <a
                href="#logout"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("logout", "Logout");
                }}
              >
                <span className="ion-ios-locked-outline"></span> Logout
              </a>
              {/* <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  handleSideNavClick("login", "Login");
                }}
              >
                <span className="ion-ios-user-outline"></span> information
              </a>
              {/* <Link href="/register">
                <span className="ion-ios-information-outline"></span> Register
              </Link> */}

              <a
                href={user && user.emailVerified ? "#logout" : "#register"}
                onClick={handleAuthAction}
                className={user && user.emailVerified ? "sign-out-link" : ""}
              >
                <span
                  className={
                    user && user.emailVerified
                      ? "ion-ios-locked-outline"
                      : "ion-ios-unlocked-outline"
                  }
                ></span>

                {user && user.emailVerified ? "Sign Out" : "Login"}
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
            className={`html matches ${
              activeHtml === "matches" ? "visible" : ""
            }`}
          >
            <RoundsViewer />
          </div>

          <div
            className={`html register ${
              activeHtml === "register" || activeHtml === "auth"
                ? "visible"
                : ""
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
                Teams
              </a>

              {/* <a href="#" className="tab">
                Messages
              </a>
              <a href="#" className="tab">
                Groups
              </a> */}
            </div>

            <div className="players">
              {teams.map((player, i) => (
                <LadderRow key={i} {...player} />
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
            className={`html information ${
              activeHtml === "information" ? "visible" : ""
            }`}
          >
            <Info activeHtml />
          </div>
        </div>
        {/* <div className={`nav ${navActive ? "active" : ""}`}>
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
            <i className="ion-ios-list-outline"></i>
            <span className="invisible">Ladder</span>
          </a>
        
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
        </div> */}
        {/* <ScrollToBottomArrow /> */}
      </div>
    </div>
  );
};

export default Home;
