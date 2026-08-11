(() => {
  const storageKey = "swipeTheFlowLanguage";
  const supportedLanguages = new Set(["ko", "en"]);
  const button = document.getElementById("languageButton");

  const savedLanguage = (() => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  })();

  const browserLanguage = navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
  let currentLanguage = supportedLanguages.has(savedLanguage) ? savedLanguage : browserLanguage;

  const applyLanguage = (language) => {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-language]").forEach((element) => {
      element.hidden = element.dataset.language !== language;
    });

    document.querySelectorAll("[data-ko][data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });

    if (button) {
      button.textContent = language === "ko" ? "EN" : "한국어";
      button.setAttribute("aria-label", language === "ko" ? "Switch to English" : "한국어로 전환");
    }

    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // The page still works when storage is unavailable.
    }
  };

  button?.addEventListener("click", () => {
    applyLanguage(currentLanguage === "ko" ? "en" : "ko");
  });

  applyLanguage(currentLanguage);
})();
