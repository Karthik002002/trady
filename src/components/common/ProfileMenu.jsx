import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { SpinnerCircularFixed } from "spinners-react";
import { APPURL } from "../../../URL";
import { useNavigate } from "react-router-dom";
import { useLocalUserData } from "../queries/UseLocalData";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [LogoutLoading, setLogoutLoading] = useState(false);
  const menuRef = useRef();
  const Navigate = useNavigate();
  const LocalData = useLocalUserData();
  const handleLogout = (e) => {
    e.preventDefault();
    setLogoutLoading(true);
    // Replace this with your actual logout logic
    fetch(APPURL.logout, {
      method: "POST",
      headers: { Authorization: `Bearer ${LocalData?.token}` },
    })
      .then((res) => {
        if (res.ok || res.status === 401) {
          window.localStorage.clear();
          Navigate("/");
          setLogoutLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error on the Logout", err);
        setLogoutLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-3xl text-sky-500 !bg-none"
      >
        <FaUserCircle size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-none border border-sky-500 shadow-lg rounded-md z-50">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2  text-sm  hover:bg-gray-100 place-items-center border-none outline-none text-sky-500  text-center"
            disabled={LogoutLoading}
          >
            {LogoutLoading ? (
              <SpinnerCircularFixed
                size={20}
                color="#00a6f4"
                speed={200}
                thickness={200}
                className="text-sky-500"
              />
            ) : (
              "Logout"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
