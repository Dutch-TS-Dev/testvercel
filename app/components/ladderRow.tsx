const LadderRow = ({
  name,
  teamId,
  rank,
}: {
  name: string;
  teamId: string;
  rank: number;
}) => {
  // Alternate animation direction based on rank
  const animationDirection = rank % 2 === 0 ? "Right" : "Left";

  // Fixed pull directions to match original HTML
  const photoDirection = "left";
  const descDirection = "left";
  const idleDirection = "right";

  // Logic for the Trophy-Icon
  const getTrophyIcon = () => {
    switch (rank) {
      case 1:
        return (
          <span className="trophy">
            <i className="ion-trophy" style={{ color: "gold" }}></i>
          </span>
        );
      case 2:
        return (
          <span className="trophy">
            <i className="ion-ribbon-a" style={{ color: "silver" }}></i>
          </span>
        );
      case 3:
        return (
          <span className="trophy">
            <i className="ion-ribbon-b" style={{ color: "#cd7f32" }}></i>
          </span>
        );
      default:
        return null;
    }
  };

  // Photo style - red circles for all teams
  const photoStyle = {
    border: "1px solid rgba(242, 51, 99, 0.7)",
    borderRadius: "50%",
    color: "rgb(255, 255, 255)",
  };

  return (
    <div
      className={`player clearfix rotateInDown${animationDirection} animated`}
    >
      <div className={`photo pull-${photoDirection}`} style={photoStyle}>
        {name === "UnKnown Team" ? "?" : name.slice(0, 1)}
      </div>
      <div className={`desc pull-${descDirection}`}>
        <p className="name">{name}</p>
        <p className="position">{name}</p>
      </div>
      <div className={`idle pull-${idleDirection}`}>
        {getTrophyIcon()}
        <span className="rank">{rank}</span>
      </div>
    </div>
  );
};

export default LadderRow;
