export const formatTimestamp = (timestamp, decimalCount = 0, decimal = ".", thousands = " ") => {
  try {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    return day + ". " + (month + 1) + ". " + year;
  } catch (e) {
    console.log(e);
  }
};
