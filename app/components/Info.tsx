import React, { useState } from "react";

export default function Info({ activeHtml }) {
  const [openSection, setOpenSection] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleSection = (sectionId) => {
    if (openSection === sectionId) {
      setOpenSection(null);
    } else {
      setOpenSection(sectionId);
    }
  };

  const toggleAllSections = () => {
    if (allExpanded) {
      setOpenSection(null);
      setAllExpanded(false);
    } else {
      setAllExpanded(true);
    }
  };

  // List of all section IDs to use with the "Expand All" feature
  const allSections = [
    "whatIsLeague",
    "matchInfo",
    "rankingSystem",
    "leagueSchedule",
    "matchResults",
    "rulesReference",
  ];

  // If allExpanded is true, we want to display all sections
  const shouldDisplay = (sectionId) => {
    return allExpanded || openSection === sectionId;
  };

  return (
    // Outer container for the Info component with scrollable area
    <div className="h-full overflow-y-auto pb-8">
      <div className="tabs-list clearfix">
        <a href="#" className="tab active">
          Teams
        </a>
        <div className="title flipInY animated">Pickleball League Rules</div>

        {/* Expand All Button */}
        <div
          className="mt-5"
          style={{ textAlign: "center", marginBottom: "15px" }}
        >
          <button
            className="btn"
            onClick={toggleAllSections}
            style={{
              padding: "8px 15px",
              fontSize: "14px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "15px",
              color: "#fff",
              cursor: "pointer",
              width: "auto",
            }}
          >
            {allExpanded ? "Collapse All Topics" : "Expand All Topics"}
          </button>
        </div>

        {/* Introduction */}
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Introduction
          </div>

          <p
            className="fadeIn animated"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
          >
            Leaqx is a webapp that allows you to connect and compete with other
            players by joining a Pickleball league in your area.
          </p>
        </div>

        {/* What is a League? */}
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            onClick={() => toggleSection("whatIsLeague")}
            style={{
              cursor: "pointer",
              position: "relative",
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            What is a League?
            <span
              className="accordion-arrow"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: `translateY(-50%) ${
                  shouldDisplay("whatIsLeague")
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                }`,
                transition: "transform 0.3s ease",
                fontSize: "12px",
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              overflow: "hidden",
              transition:
                "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
              maxHeight: shouldDisplay("whatIsLeague") ? "500px" : "0px",
              opacity: shouldDisplay("whatIsLeague") ? 1 : 0,
            }}
          >
            <div
              className={`rule-details ${
                shouldDisplay("whatIsLeague") ? "slideInDown" : "slideOutUp"
              } animated`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingLeft: "15px",
              }}
            >
              <p>
                • A league is a 2-weekly (one league round lasts exactly 2
                weeks) competition.
              </p>
              <p>• A league is connected to either a club, or a city.</p>
              <p>
                • If you want to start your own league please connect with us
                through our contact form.
              </p>
              <p>
                • currently we only support doubles, but singles will be added
                in the future.
              </p>
            </div>
          </div>
        </div>

        {/* Match Info (Combined section) */}
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            onClick={() => toggleSection("matchInfo")}
            style={{
              cursor: "pointer",
              position: "relative",
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Match Info
            <span
              className="accordion-arrow"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: `translateY(-50%) ${
                  shouldDisplay("matchInfo") ? "rotate(180deg)" : "rotate(0deg)"
                }`,
                transition: "transform 0.3s ease",
                fontSize: "12px",
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              overflow: "hidden",
              transition:
                "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
              maxHeight: shouldDisplay("matchInfo") ? "500px" : "0px",
              opacity: shouldDisplay("matchInfo") ? 1 : 0,
            }}
          >
            <div
              className={`rule-details ${
                shouldDisplay("matchInfo") ? "slideInDown" : "slideOutUp"
              } animated`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingLeft: "15px",
              }}
            >
              <p>• Match Format: Best-of-three games.</p>
              <p>
                • Scoring System: Traditional scoring (only the serving team can
                score points).
              </p>
              <p>
                • Scheduling: Every two weeks on Sunday, a new round begins.
              </p>
              <p>• Teams have exactly two weeks to play their match.</p>
              <p>
                • By registering with this app, you automatically agree to other
                users having access to your email address for the purpose of
                contacting you to set up matches.
              </p>
              <p>
                • Teams coordinate directly via email to decide when and where
                matches will be played.
              </p>
              <p>
                • If a match is not played within the two-week window, a reason
                must be provided.
              </p>
            </div>
          </div>
        </div>
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            onClick={() => toggleSection("rankingSystem")}
            style={{
              cursor: "pointer",
              position: "relative",
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Ranking System
            <span
              className="accordion-arrow"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: `translateY(-50%) ${
                  shouldDisplay("rankingSystem")
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                }`,
                transition: "transform 0.3s ease",
                fontSize: "12px",
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              overflow: "hidden",
              transition:
                "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
              maxHeight: shouldDisplay("rankingSystem") ? "500px" : "0px",
              opacity: shouldDisplay("rankingSystem") ? 1 : 0,
            }}
          >
            <div
              className={`rule-details ${
                shouldDisplay("rankingSystem") ? "slideInDown" : "slideOutUp"
              } animated`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingLeft: "15px",
              }}
            >
              <p>• Every beginning of the</p>
              <p>• The winning team takes the position of the losing team.</p>
              <p>
                • If the higher-ranked team wins, they retain their position.
              </p>
              <p>
                • If the number 1 team wins, they always remain in the top
                position.
              </p>
              <p>
                • Future versions of the league may adopt an Elo-based ranking
                system.
              </p>
            </div>
          </div>
        </div>

        {/* League Schedule */}
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            onClick={() => toggleSection("leagueSchedule")}
            style={{
              cursor: "pointer",
              position: "relative",
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            League Schedule
            <span
              className="accordion-arrow"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: `translateY(-50%) ${
                  shouldDisplay("leagueSchedule")
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                }`,
                transition: "transform 0.3s ease",
                fontSize: "12px",
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              overflow: "hidden",
              transition:
                "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
              maxHeight: shouldDisplay("leagueSchedule") ? "500px" : "0px",
              opacity: shouldDisplay("leagueSchedule") ? 1 : 0,
            }}
          >
            <div
              className={`rule-details ${
                shouldDisplay("leagueSchedule") ? "slideInDown" : "slideOutUp"
              } animated`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingLeft: "15px",
              }}
            >
              <p>• Every League round lasts exactly 2 weeks.</p>
              <p>
                • Every second Sunday at 00:00, the previous round closes and
                the next round starts.
              </p>
              <p>• All rankings are updated at this time.</p>
              <p>
                • All teams are assigned a new match for the upcoming round.
              </p>
            </div>
          </div>
        </div>

        {/* Match Results */}
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            onClick={() => toggleSection("matchResults")}
            style={{
              cursor: "pointer",
              position: "relative",
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Match Results
            <span
              className="accordion-arrow"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: `translateY(-50%) ${
                  shouldDisplay("matchResults")
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                }`,
                transition: "transform 0.3s ease",
                fontSize: "12px",
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              overflow: "hidden",
              transition:
                "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
              maxHeight: shouldDisplay("matchResults") ? "500px" : "0px",
              opacity: shouldDisplay("matchResults") ? 1 : 0,
            }}
          >
            <div
              className={`rule-details ${
                shouldDisplay("matchResults") ? "slideInDown" : "slideOutUp"
              } animated`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingLeft: "15px",
              }}
            >
              <p>
                • Match results must be registered by logging into our webapp
                and using the "Register" menu option.
              </p>
            </div>
          </div>
        </div>

        {/* Rules Reference */}
        <div className="credit-ol">
          <div
            className="credit-li lightSpeedIn animated"
            onClick={() => toggleSection("rulesReference")}
            style={{
              cursor: "pointer",
              position: "relative",
              fontSize: "18px",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Rules Reference
            <span
              className="accordion-arrow"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: `translateY(-50%) ${
                  shouldDisplay("rulesReference")
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                }`,
                transition: "transform 0.3s ease",
                fontSize: "12px",
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              overflow: "hidden",
              transition:
                "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
              maxHeight: shouldDisplay("rulesReference") ? "500px" : "0px",
              opacity: shouldDisplay("rulesReference") ? 1 : 0,
            }}
          >
            <div
              className={`rule-details ${
                shouldDisplay("rulesReference") ? "slideInDown" : "slideOutUp"
              } animated`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                paddingLeft: "15px",
              }}
            >
              <p>
                •{" "}
                <a
                  href="https://usapickleball.org/what-is-pickleball/official-rules/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  Official Pickleball Rules
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking System */}
    </div>
  );
}
