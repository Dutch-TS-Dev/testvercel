// Simplified LadderRow without the component structure
// and without unnecessary refs
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
  const animationDirection = Number(!!rank) % 2 === 0 ? "Right" : "Left";

  // Dynamically determine pull direction based on rank
  const photoDirection = Number(!!rank) % 2 === 0 ? "right" : "left";
  const descDirection = Number(!!rank) % 2 === 0 ? "right" : "left";
  const idleDirection = Number(!!rank) % 2 === 0 ? "left" : "right";

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

  return (
    <div
      className={`player clearfix rotateInDown${animationDirection} animated`}
    >
      <div
        className={`photo pull-${photoDirection}`}
        style={{
          border: "1px solid rgba(242, 51, 99,0.7)",
          borderRadius: "50%",
          color: "rgb(255,255,255)",
        }}
      >
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
