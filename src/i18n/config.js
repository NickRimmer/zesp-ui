import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const languages = ["en"];
const namespaces = [
    "common",
    "nav",
    "pages.setup-mqtt",
    "pages.setup-wifi",
    "pages.welcome",
    "pages.devices",
];

const i18next = i18n.use(initReactI18next);
i18next.init({
    fallbackLng: languages[0],
    lng: languages[0],
    resources: loadResources(),
    ns: namespaces,
    defaultNS: 'common'
});
i18n.languages = languages;

function loadResources() {
    const result = {};

    for (let lang of languages) {
        result[lang] = {};

        for (let ns of namespaces) {
            const path = `./locales/${lang}/${ns.replace(".", "/")}.json`;
            try {
                // eslint-disable-next-line 
                result[lang][ns] = require('' + path); // wtf with JS???
              // console.debug(`${path} (ok)`);
            } catch (error) {
                // it's ok
                console.debug(`${path} (error)`);
            }
        }
    }

    return result;
}

export default i18n;