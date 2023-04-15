import Bowser from "bowser";

export default function getBrowser() {
    if (typeof window !== "object") {
        return null;
    }

    return Bowser.getParser(window.navigator.userAgent)
}

export function isSafari () {
    return getBrowser()?.getBrowserName() === "Safari";
}