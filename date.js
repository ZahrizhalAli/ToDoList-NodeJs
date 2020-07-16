exports.getDate = function() {
  var day = new Date();
  var options = {
    weekday: 'long',
    day: "numeric",
    month: 'long'
  };
  return day.toLocaleDateString("en-US", options);
};
