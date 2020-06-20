import React from "react";
import { PropTypes } from "prop-types";

import "./index.css";

function UserCard({ id, name, address, pincode, items }) {
  return (
    <div className="card">
      <div className="card__id">{id}</div>
      <div className="card__name">{name}</div>
      <div className="card__address">{address + " " + pincode}</div>
    </div>
  );
}

UserCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  address: PropTypes.string,
  pincode: PropTypes.string,
  items: PropTypes.array,
};

export default UserCard;
