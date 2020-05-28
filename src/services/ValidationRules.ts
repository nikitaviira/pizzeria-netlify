import { i18n } from '@/plugins/i18n';

export default {
    required: (value: string) => !!value || i18n.tc('errors.fieldRequired'),
    min: (value: string) => value.length >= 6 || i18n.tc('errors.minPasswordLength'),
    atLeastOneCapCharAndNum: (value: string) =>
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$^+=!/.,*()@%&]).{6,}$').test(value)
        || i18n.tc('errors.atLeastOneCapCharAndNum'),
    charMatch: (value: string) => new RegExp('^[a-zA-Z\\s]+$').test(value) || i18n.tc('errors.charMatch'),
    numberMatch: (value: string) => new RegExp('^[0-9]+$').test(value) || i18n.tc('errors.numberMatch'),
    telephoneMatch: (value: string) => new RegExp('^[0-9+]+$').test(value) || i18n.tc('errors.telephoneMatch'),
    emailMatch: (value: string) => new RegExp('^\\S+@\\S+\\.[a-z]+$').test(value) || i18n.tc('errors.emailMatch'),
};
