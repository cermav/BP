import React, { useEffect, useState, useRef } from "react";
import Link from "../../components/ActiveLink";
import { useDispatch, useSelector } from "react-redux";

import {
  getAuthorizationHeader,
  isAuthorized,
  isVet,
  isAdmin,
  getUserName,
  getAvatar,
  getUserRole,
  getUserId,
} from "../../services/AuthToken";
import { logout } from "../../redux/actions/user";

const Header = () => {
  const [sticky, setSticky] = useState(false);
  const [petString, setPetString] = useState("");

  const imageRedux = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const inputRef = useRef(null);
  const menuRef = React.createRef();

  useEffect(() => {
    const fetchLastPetId = async () => {
      const response = await fetch(process.env.apiURL + "pets/latest", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getAuthorizationHeader(),
        },
      });
      const responseObject = await response.json();
      setPetString(`zvire/${responseObject}`);
    };
    isAuthorized() && fetchLastPetId();
  }, []);

  useEffect(() => {
    setSticky(window.pageYOffset > 0);
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const checkScroll = () => {
    setSticky(window.pageYOffset > 0);
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      if (inputRef.current.checked === true) {
        inputRef.current.checked = false;
      }
    }
  };

  const profileUrl = isAuthorized() ? (isAdmin() ? "/admin/dashboard" : isVet() ? "/vet/profile" : "/profil") : "";
  let userImagePath = "/";
  switch (getUserRole()) {
    case 1:
      userImagePath = "/users/";
      break;
    case 2:
      userImagePath = "/profile/";
      break;
    case 3:
      userImagePath = "/member/";
      break;
    default:
      userImagePath = "/users/";
      break;
  }
  let userMenu = !isAuthorized() ? (
    <li className="userMenu">
      <Link activeClassName="active" href="/login">
        <a href="/login" className="button">
          Přihlásit
        </a>
      </Link>
    </li>
  ) : (
    <li className="userMenu">
      <div className="userName isAdmin">
        <Link activeClassName="active" href={profileUrl}>
          <a
            href={profileUrl}
            key={imageRedux.avatar}
            className={getAvatar() !== null ? "avatar" : "fakeAvatar"}
            style={{
              backgroundImage: `url(${
                getAvatar() !== null ? process.env.storageUrl + userImagePath + getAvatar() : ""
              })`,
            }}
            title={`You are logged in as ${getUserName()}.`}
          >
            {getUserName()}
          </a>
        </Link>
      </div>
      <ul>
        <React.Fragment>
          <li>
            <Link activeClassName="active" href={profileUrl}>
              <a href={profileUrl}>Můj profil</a>
            </Link>
          </li>
        </React.Fragment>
        <li>
          <button onClick={logoutUser} id="logout">
            Logout
          </button>
        </li>
      </ul>
    </li>
  );

  return (
    <header className={`header ${sticky ? "sticky" : ""}`} id="header">
      <div className="container wide headerInner">
        <div className="left">
          <Link href="/">
            <a href="/" className="logo headerLogo">
              Dr.Mouse
            </a>
          </Link>
          <span onClick={logoutUser} id="logout2" style={{ width: "5px", height: "5px", overflow: "hidden" }}></span>
          <nav id="menuToggle" className="menu">
            <input type="checkbox" ref={inputRef} />
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <ul id="menu" ref={menuRef}>
              <li>
                {isAuthorized() ? (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <a aspath="records" href={"/records"} id="myRecords">
                      Záznamy
                    </a>
                    <a aspath="calendar" href={`/calendar/${getUserId()}`} id="myCalendar">
                      Kalendář
                    </a>
                    <a aspath="moje-zver" href={`/moje-zver/${petString}`} id="myPets">
                      Moje zvěř
                    </a>
                  </div>
                ) : (
                  <Link activeClassName="active" href="/moje-zver">
                    <a href="/moje-zver" id="myPets">
                      Moje zvěř
                    </a>
                  </Link>
                )}
              </li>
              {userMenu}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;
