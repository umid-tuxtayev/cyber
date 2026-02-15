"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { authChangePassword } from "../services/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: authChangePassword,
    onSuccess: () => {
      setPasswordError("");
      setPasswordMessage("Password changed successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    },
    onError: (err) => {
      setPasswordMessage("");
      setPasswordError(err?.response?.data?.message || "Password change failed.");
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError("Old and new password are required.");
      return;
    }
    changePasswordMutation.mutate(passwordForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-50 from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-8">
      <div className="relative max-w-md mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
          {user?.email || "No email"} {user?.role ? `(${user.role})` : ""}
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon /> : <Sun />}
              <span>Dark Mode</span>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full"
            >
              {isDarkMode ? "Disable" : "Enable"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe />
              <span>Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-full"
            >
              <option value="en">English</option>
              <option value="uz">O'zbek</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Open Profile Dropdown
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-5">
            <h3 className="font-semibold">Change Password</h3>
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
              }
              placeholder="Old password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg"
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              placeholder="New password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg"
            />
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-60"
            >
              {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
