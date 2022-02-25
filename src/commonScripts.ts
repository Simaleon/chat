export class CommonScripts {
    static isMessageEnoughLength(str: string) {
        const length = 10;

        return  str.length > length;
    }

    static hasURL(str: string) {
        const urlCheck = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");

        return urlCheck.test(str);
    }

    static validateEmail(email: string) {
        // email validation RFC2822
        // https://regexr.com/2rhq7
        const validRegexp = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])/;

        return String(email).toLowerCase().match(validRegexp);
    }

    static validateMessage(str: string) {
        let validRegexp = /([a-z, 0-9])\1{4}/;

        return String(str).toLowerCase().match(validRegexp);
    }
}