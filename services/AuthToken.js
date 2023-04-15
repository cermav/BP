import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import Router from "next/router";

export const TOKEN_STORAGE_KEY = "drmouseToken";
export const FACEBOOK_ACCESS_TOKEN = "FacebookToken";
export const GOOGLE_ACCESS_TOKEN = "GoogleToken";
export const FACEBOOK_USER_ID = "FBUserID";

export const setToken = (token) => {
    if (typeof token === "undefined") return false;
    Cookies.set(TOKEN_STORAGE_KEY, token);

    if (
        isAuthorized() &&
        typeof window === "object" &&
        window.localStorage &&
        window.localStorage.getItem("lastClicked") === "pets"
    ) {
        redirectToPet(token);
    } else redirectToProfile(token);
};

const redirectToProfile = async (token) => {
    if (isAdmin(token)) {
        Router.push("/admin/vets");
    } else if (isVet(token)) {
        Router.push("/vet/profile");
    } else {
        Router.push("/profil")
    }
}

const redirectToPet = async (token) => {
    const response = await fetch(process.env.apiURL + "pets/latest", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getAuthorizationHeader(),
        },
    });
    const responseObject = await response.json();

    if (response.status === 200) {
        Router.push(responseObject === 0 ? `/moje-zver/zvire/vytvorit` : `/moje-zver/zvire/${responseObject}`);
    }

    if (response.status === 404) {
        redirectToProfile();
    }
};

export const getCookiesToken = () => {
    return Cookies.get(TOKEN_STORAGE_KEY);
};

export const getAuthorizationHeader = () => {
    return `Bearer ${getCookiesToken()}`;
};

const getDecodedToken = (token) => {
    if (!token || token === "" || typeof token === "undefined") {
        return false;
    }
    return jwtDecode(token);
};

export const isAuthorized = (ctxToken = null) => {
    const token = ctxToken || getCookiesToken();
    const tokenData = getDecodedToken(token);
    if (!tokenData) {
        return false;
    }
    const expiredAt = new Date(tokenData.exp * 1000);
    return new Date() < expiredAt;
};

export const getUserRole = (ctxToken = null) => {
    const token = ctxToken || getCookiesToken();
    const tokenData = getDecodedToken(token);
    return tokenData ? parseInt(tokenData.role_id, 10) : null;
};

export const userRoles = {
    ADMINISTRATOR: 1,
    DOCTOR: 2,
    MEMBER: 3,
};

export const getAvatar = (ctxToken = null) => {
    const token = ctxToken || getCookiesToken();
    const tokenData = getDecodedToken(token);
    return tokenData ? tokenData.avatar : null;
};

export const getUserId = (ctxToken = null) => {
    const token = ctxToken || getCookiesToken();
    const tokenData = getDecodedToken(token);
    return tokenData ? tokenData.sub : null;
};
export const getUserName = (ctxToken = null) => {
    const token = ctxToken || getCookiesToken();
    const tokenData = getDecodedToken(token);
    return tokenData ? tokenData.name : null;
};

export const isVet = (ctxToken = null) => {
    return getUserRole(ctxToken) === 2;
};

export const isAdmin = (ctxToken = null) => {
    return getUserRole(ctxToken) === 1;
};

export const logout = async () => {
    Cookies.remove(TOKEN_STORAGE_KEY);

    const revokeGoogleToken = async (accessToken) => {
        var revokeTokenEndpoint = "https://oauth2.googleapis.com/revoke";
        // Google's OAuth 2.0 endpoint for revoking access tokens.

        var dummy = document.createElement("iframe");
        dummy.setAttribute("name", "dummy");
        dummy.setAttribute("id", "dummy");
        dummy.setAttribute("style", "display: none");

        // Create <form> element to use to POST data to the OAuth 2.0 endpoint.
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", revokeTokenEndpoint);
        form.setAttribute("target", "dummy");

        var tokenField = document.createElement("input");
        tokenField.setAttribute("type", "hidden");
        tokenField.setAttribute("name", "token");
        tokenField.setAttribute("value", accessToken);
        form.appendChild(tokenField);

        // Add form to page and submit it to actually revoke the token.
        document.body.appendChild(form);
        document.body.appendChild(dummy);
        form.submit();
        Cookies.remove(GOOGLE_ACCESS_TOKEN);
    };
    const revokeFacebookLogin = async (userID, accessToken) => {
        await fetch("https://graph.facebook.com/" + userID + "/permissions?access_token=" + accessToken, {
            method: "DELETE",
        });
        //if (response.status == 200) {
        Cookies.remove(FACEBOOK_ACCESS_TOKEN);
        Cookies.remove(FACEBOOK_USER_ID);
        //}
    };
    if (Cookies.get(GOOGLE_ACCESS_TOKEN) && Cookies.get(GOOGLE_ACCESS_TOKEN) !== "undefined")
        revokeGoogleToken(Cookies.get(GOOGLE_ACCESS_TOKEN));
    if (Cookies.get(FACEBOOK_ACCESS_TOKEN) && Cookies.get(FACEBOOK_ACCESS_TOKEN) !== "undefined")
        revokeFacebookLogin(Cookies.get(FACEBOOK_USER_ID), Cookies.get(FACEBOOK_ACCESS_TOKEN));
    window.localStorage.setItem("logout", Date.now()); // update storage to fire synchornize event in hoc component
    await Router.push("/login");
};
