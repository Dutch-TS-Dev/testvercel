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
  // Fix: Use rank directly instead of Number(!!rank)
  const animationDirection = rank % 2 === 0 ? "Right" : "Left";

  // Dynamically determine pull direction based on rank
  // The original HTML shows all photos are pull-left
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

  // Calculate background color based on rank for visual variety
  const getPhotoStyle = () => {
    if (rank <= 3) {
      return {
        border: "1px solid rgba(242, 51, 99,0.7)",
        borderRadius: "50%",
        color: "rgb(255,255,255)",
      };
    }

    // Generate a semi-random color based on the rank
    const hue1 = (rank * 25) % 256;
    const hue2 = (rank * 40) % 256;
    const hue3 = (rank * 60) % 256;
    const color = `rgb(${120 + (hue1 % 56)}, ${120 + (hue2 % 56)}, ${
      120 + (hue3 % 56)
    })`;

    return {
      backgroundColor: "transparent",
      backgroundImage: `linear-gradient(45deg, ${color}, transparent 45%, ${color})`,
      borderColor: color,
      color: color,
      borderRadius: "50%",
    };
  };

  return (
    <div
      className={`player clearfix rotateInDown${animationDirection} animated`}
    >
      <div className={`photo pull-${photoDirection}`} style={getPhotoStyle()}>
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
