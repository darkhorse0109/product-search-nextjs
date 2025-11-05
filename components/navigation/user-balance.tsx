"use client";

import { GrDiamond } from "react-icons/gr";
import { useAuth } from "@/providers/auth-provider";

const UserBalance = () => {
  const { user_balance } = useAuth()
  return (
    <div className="flex items-center gap-2">
      <GrDiamond className="w-6 h-6 font-bold block" style={{ stroke: "url(#icon-gradient)" }} />
      <span className="text-xl font-semibold">{user_balance}</span>
    </div>
  )
}

export default UserBalance;