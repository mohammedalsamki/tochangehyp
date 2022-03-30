import React from "react";

const FormattedNo = ({ val }) => {
  const myClass =
    val === "0" || val === 0
      ? "badge badge-warning m-2"
      : "badge badge-primary m-2";
  return <span className={myClass}>{val}</span>;
};

export default FormattedNo;
