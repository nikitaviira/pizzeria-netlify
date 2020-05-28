import { i18n } from './i18n';
import Axios from 'axios';

const Trans = {
    get defaultLocale(): string {
        return 'en';
    },
    get supportedLocales(): string[] {
        return ['en', 'ru'];
    },
    get currentLocale(): string {
        return i18n.locale;
    },
    set currentLocale(locale) {
        i18n.locale = locale;
    },
    changeLocale(locale: string): Promise<string | Error> {
        if (!Trans.isLocaleSupported(locale)) {
            return Promise.reject(new Error('Locale not supported'));
        }

        if (i18n.locale === locale) {
            return Promise.resolve(locale);
        }

        return Trans.loadLocaleFile(locale)
            .then((msgs: any) => {
                i18n.setLocaleMessage(locale, msgs.default || msgs);

                return Trans.setI18nLocaleInServices(locale);
            });
    },
    isLocaleSupported(locale: string): boolean {
        return Trans.supportedLocales.includes(locale);
    },
    loadLocaleFile(locale: string): any {
        return import(`@/locale/locale-${locale}.json`);
    },
    setI18nLocaleInServices(locale: string): string {
        Trans.currentLocale = locale;
        Axios.defaults.headers.common['Accept-Language'] = locale;
        document.querySelector('html')!.setAttribute('lang', locale);

        return locale;
    },
    routeMiddleware(to: any, from: any, next: any) {
        const locale = to.params.locale;

        if (!Trans.isLocaleSupported(locale)) {
            return next(Trans.getUserSupportedLocale());
        }

        return Trans.changeLocale(locale).then(() => next());
    },
    i18nRoute(to: any) {
        return {
            ...to,
            params: { locale: this.currentLocale, ...to.params }
        };
    },
    getUserSupportedLocale() {
        const userPreferredLocale = Trans.getUserLocale();

        if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
            return userPreferredLocale.locale;
        }

        if (Trans.isLocaleSupported(userPreferredLocale.localeNoISO)) {
            return userPreferredLocale.localeNoISO;
        }

        return Trans.defaultLocale;
    },
    getUserLocale() {
        const locale = window.navigator.language || Trans.defaultLocale;

        return {
            locale,
            localeNoISO: locale.split('-')[0]
        };
    }
};

export { Trans };
