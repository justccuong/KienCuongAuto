import React from "react";
import classNames from "classnames";

export function Card({ className, children }) {
  return (
    <div
      className={classNames(
        "bg-white shadow-md rounded-2xl border border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={classNames("p-6", className)}>
      {children}
    </div>
  );
}
