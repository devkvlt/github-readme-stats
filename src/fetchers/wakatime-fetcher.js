const axios = require("axios");
// const patchLanguages = require("../patch-languages");
// Patching languages is not necessary as that can be done upfront on Wakatime

const fetchWakatimeStats = async ({ username, api_domain, range }) => {
  try {
    const { data } = await axios.get(
      `https://${
        api_domain ? api_domain.replace(/\/$/gi, "") : "wakatime.com"
      }/api/v1/users/${username}/stats/${range || ""}?is_including_today=true`,
    );
    // data.data.languages = patchLanguages(data.data.languages);
    data.data.languages = data.data.languages.slice(0, 12);
    let total = 0;
    for (let i = 0; i < 12; i++) {
      total += data.data.languages[i].percent;
    }
    data.data.languages.forEach(
      (lang) => (lang.percent = (lang.percent * 100) / total),
    );
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
