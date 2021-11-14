function getParentLanguageName(languageName) {
  switch (languageName) {
    case "zsh":
      return "Shell";
    case "sh":
      return "Shell";
    case "Bash":
      return "Shell";
    case "JSX":
      return "JavaScript";
  }
}

function makeText(hours, minutes, seconds) {
  let text = [];
  hours !== 0 && (text[0] = hours === 1 ? hours + " hr" : hours + " hrs");
  minutes !== 0 &&
    (text[1] = minutes === 1 ? minutes + " min" : minutes + " mins");
  hours === 0 && minutes === 0 && (text[2] = seconds + " secs");
  return text.filter((element) => element !== undefined).join(" ");
}

module.exports = function patchLanguages(languages) {
  const languagesPatched = [];
  languages.forEach((language) => {
    let parentLanguageName = getParentLanguageName(language.name);
    if (parentLanguageName) {
      let parentLanguage = languagesPatched.find(
        (lang) => lang.name === parentLanguageName,
      );
      if (parentLanguage) {
        parentLanguage.hours += language.hours;
        parentLanguage.minutes += language.minutes;
        if (parentLanguage.minutes / 60 >= 1) {
          parentLanguage.hours += 1;
          parentLanguage.minutes -= 60;
        }
        parentLanguage.percent += language.percent;
        parentLanguage.text = makeText(
          parentLanguage.hours,
          parentLanguage.minutes,
          0,
        );
      } else {
        parentLanguage = language;
        parentLanguage.name = parentLanguageName;
        languagesPatched.push(parentLanguage);
      }
    } else {
      languagesPatched.push(language);
    }
  });
  return languagesPatched;
};
