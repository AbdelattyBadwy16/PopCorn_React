import full from "./full.png";
import emp from "./empty.png";
import { useState } from "react";

const starStyles = {
  width: "20px",
  cursor: "pointer",
};

const starsStyles = {
  display: "flex",
  listStyleType: "none",
};

export default function Stars({ len }) {
  const star = <img style={starStyles} src={full} alt="star" />;
  const items = new Array();
  for (let i = 0; i < len; i++) items.push({ id: i + 1 });
  const [selected, setSelected] = useState(0);
  const [tempRating,setTempRating]= useState(0);

  let i = 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <ul style={starsStyles}>
        {items.map((item) => (
          <ShowItem
            setSelected={setSelected}
            key={item.id}
            item={item}
            selected={selected}
            setTempRating={setTempRating}
            tempRating={tempRating}
          ></ShowItem>
        ))}
      </ul>
      <p style={{ marginLeft: "5px", fontSize: "20px" }}>
        {tempRating ? tempRating : (selected)?selected:""}
      </p>
    </div>
  );
}

function ShowItem({ item, setSelected, selected , setTempRating , tempRating }) {
  return (
    <li>
      {(tempRating?item.id>tempRating : item.id>selected)? (
        <img
          style={starStyles}
          onClick={() => {
            setSelected(item.id);
          }}
          src={emp}
          alt="star"
          onMouseEnter={() => setTempRating(item.id)}
          onMouseLeave={() => setTempRating(0)}
        />
      ) : (
        <img
          style={starStyles}
          onClick={() => setSelected(item.id)}
          src={full}
          alt="star"
          onMouseEnter={() => setTempRating(item.id)}
          onMouseLeave={() => setTempRating(0)}
        />
      )}
    </li>
  );
}
