const axios = require("axios");

const fetchWakatimeStats = async ({ username, api_domain, range }) => {
  try {
    const { data } = await axios.get(
      `https://${
        api_domain ? api_domain.replace(/\/$/gi, "") : "wakatime.com"
      }/api/v1/users/${username}/stats/${range || ""}?is_including_today=true`,
    );
    const languagesPatched = [];
    data.data.languages.forEach((language) => {
      if (
        language.name === "zsh" ||
        language.name === "sh" ||
        language.name === "Bash"
      ) {
        let shell = languagesPatched.find(
          (language) => language.name === "Shell",
        );
        if (shell) {
          shell.hours += language.hours;
          shell.minutes += language.minutes;
          shell.percent += language.percent;
        } else {
          shell = language;
          shell.name = "Shell";
          languagesPatched.push(shell);
        }
      } else if (language.name === "JSX") {
        let js = languagesPatched.find(
          (language) => language.name === "JavaScript",
        );
        if (js) {
          js.hours += language.hours;
          js.minutes += language.minutes;
          js.percent += language.percent;
        } else {
          js = language;
          js.name = "JavaScript";
          languagesPatched.push(js);
        }
      } else {
        languagesPatched.push(language);
      }
    });
    data.data.languages = languagesPatched;
    return data.data;
  } catch (err) {
    if (err.response.status < 200 || err.response.status > 299) {
      throw new Error(
        "Wakatime user not found, make sure you have a wakatime profile",
      );
    }
    throw err;
  }
};

module.exports = {
  fetchWakatimeStats,
};
