export const calcterm = (timestamp1, timestamp2) => {
    let result = new Date(timestamp1) - new Date(timestamp2);
    let oneDay = 24 * 60 * 60 * 1000;
    result = Math.round(result / oneDay);
    let appendix;
    let prefix;
    if (result < -365) return "před více než rokem";
    if (result >= 365) return "za více než rok";
    if (result == 1) return "zítra";
    if (result == -1) {
        return "včera";
    }
    if (result == 0) return "dnes";
    if (result <= 364) {
        prefix = "za ";
        appendix = " dní";
    }
    if (result <= 4) {
        appendix = " dny";
    }
    if (result <= -2) {
        prefix = "před ";
    }
    result = Math.abs(result);
    let output = prefix + " " + result + " " + appendix;
    return output;
};
