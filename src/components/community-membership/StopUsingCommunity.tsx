"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function StopUsingCommunity() {
  const {
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
  } = useAuth();

  function handleStopUsingCommunity() {
    localStorage.removeItem("selectedCommunity");
    localStorage.removeItem("selectedCommunity");
    localStorage.removeItem("userMemberships");
    localStorage.removeItem("userAdmins");
    setSelectedCommunity(null);
    setUserMemberships(null);
    setUserAdmins(null);
  }

  return (
    <button
      onClick={handleStopUsingCommunity}
      className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
    >
      <span>Jump Out</span>
    </button>
  );
}
