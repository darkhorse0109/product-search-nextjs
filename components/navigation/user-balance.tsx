"use client";

import { GrDiamond } from "react-icons/gr";

const UserBalance = () => {
  const balance = 300;
  return (
    <div className="flex items-center gap-2">
      <GrDiamond className="w-6 h-6 font-bold block" style={{ stroke: "url(#icon-gradient)" }} />
      <span className="text-xl font-semibold">{balance}</span>
    </div>
  )
}

export default UserBalance;