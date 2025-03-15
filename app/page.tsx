import React from "react";

const Home = () => {
  return (
    <div className="mobile-wrap">
      <div className="mobile">
        <div className="header clearfix">
          <span className="pull-left ion-ios-arrow-back"></span>
          <span className="title">Title</span>
          <span className="pull-right ion-ios-search"></span>
        </div>
        <div className="nav active">
          <div className="mask"></div>
        </div>
        <div className="sidebar">
          <div className="sidebar-overlay"></div>
          <div className="sidebar-content">
            <div className="top-head">
              <div className="name">User Name</div>
              <div className="email">user@example.com</div>
            </div>
            <div className="nav-left">
              <a href="#">
                <span className="icon"></span> Menu Item
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
