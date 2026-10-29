(() => {
  const storageKey = "swipeTheFlowLanguage";
  const supportedLanguages = ["ko", "en", "ja"];
  const buttonLabels = { ko: "한국어", en: "EN", ja: "日本語" };
  const switchLabels = {
    ko: "한국어로 전환",
    en: "Switch to English",
    ja: "日本語に切り替える",
  };
  const button = document.getElementById("languageButton");

  // A page only offers the languages it actually contains. support.html has no
  // Japanese document body, so the Japanese option must not appear there.
  const documentBlocks = document.querySelectorAll("[data-language]");
  const availableLanguages = documentBlocks.length
    ? supportedLanguages.filter((language) =>
        document.querySelector(`[data-language="${language}"]`)
      )
    : supportedLanguages.slice();

  const resolve = (language) => {
    if (availableLanguages.includes(language)) return language;
    if (availableLanguages.includes("en")) return "en";
    return availableLanguages[0];
  };

  const savedLanguage = (() => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  })();

  const browserLanguage = (() => {
    const tag = (navigator.language || "en").toLowerCase();
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("ja")) return "ja";
    return "en";
  })();

  // 지난 판(versions/ 08-11~09-25) 전용 사본이다. 주소의 ?lang을 먼저 본다(지금 사이트 /assets/site.js와 같은 순서).
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  const preferredLanguage = supportedLanguages.includes(urlLanguage)
    ? urlLanguage
    : supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : browserLanguage;
  let currentLanguage = resolve(preferredLanguage);

  const applyLanguage = (language) => {
    currentLanguage = resolve(language);
    document.documentElement.lang = currentLanguage;

    documentBlocks.forEach((element) => {
      element.hidden = element.dataset.language !== currentLanguage;
    });

    document.querySelectorAll("[data-ko][data-en]").forEach((element) => {
      // Chrome shared with pages that have no Japanese copy falls back to English.
      element.textContent =
        element.dataset[currentLanguage] ?? element.dataset.en;
    });

    if (button) {
      const nextLanguage =
        availableLanguages[
          (availableLanguages.indexOf(currentLanguage) + 1) %
            availableLanguages.length
        ];
      button.textContent = buttonLabels[nextLanguage];
      button.setAttribute("aria-label", switchLabels[nextLanguage]);
      button.dataset.nextLanguage = nextLanguage;
      button.hidden = availableLanguages.length < 2;
    }

    try {
      window.localStorage.setItem(storageKey, currentLanguage);
    } catch {
      // The page still works when storage is unavailable.
    }
  };

  button?.addEventListener("click", () => {
    applyLanguage(button.dataset.nextLanguage);
  });

  applyLanguage(currentLanguage);
})();
