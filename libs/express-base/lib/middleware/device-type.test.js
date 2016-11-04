'use strict';

const assert = require('power-assert');
const deviceType = require('./device-type');
const { detectDeviceType } = deviceType;

/* eslint-disable max-len */
const uaStrings = {
    galaxys5: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
    nexus5: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
    nexus5x: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
    nexus6p: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
    iphone4: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    iphone5: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    iphone6: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    iphone6p: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    ipad: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    ipadMini: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    chromeDesktop53: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
    firefoxDesktop49: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:49.0) Gecko/20100101 Firefox/49.0',
    safariDesktop10: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Safari/602.1.50',
    ie11: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
    ie10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',
    random: 'lollerskates',
};
/* eslint-enable max-len */

describe('Device type ua parser', () => {
    it('galaxys5', () => {
        const typeInfo = detectDeviceType(uaStrings.galaxys5.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('nexus5', () => {
        const typeInfo = detectDeviceType(uaStrings.nexus5.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('nexus5x', () => {
        const typeInfo = detectDeviceType(uaStrings.nexus5x.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('nexus6p', () => {
        const typeInfo = detectDeviceType(uaStrings.nexus6p.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('iphone5', () => {
        const typeInfo = detectDeviceType(uaStrings.iphone5.toLowerCase());
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('iphone4', () => {
        const typeInfo = detectDeviceType(uaStrings.iphone4.toLowerCase());
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('iphone6', () => {
        const typeInfo = detectDeviceType(uaStrings.iphone6.toLowerCase());
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('iphone6p', () => {
        const typeInfo = detectDeviceType(uaStrings.iphone6p.toLowerCase());
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('ipad', () => {
        const typeInfo = detectDeviceType(uaStrings.ipad.toLowerCase());
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('ipad mini', () => {
        const typeInfo = detectDeviceType(uaStrings.ipadMini.toLowerCase());
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });

    it('chrome 53 desktop', () => {
        const typeInfo = detectDeviceType(uaStrings.chromeDesktop53.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(!typeInfo.isProbablyMobileOrTablet);
    });

    it('firefox 49 desktop', () => {
        const typeInfo = detectDeviceType(uaStrings.firefoxDesktop49.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(!typeInfo.isProbablyMobileOrTablet);
    });

    it('safari 10 desktop', () => {
        const typeInfo = detectDeviceType(uaStrings.safariDesktop10.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(!typeInfo.isProbablyMobileOrTablet);
    });

    it('ie 10 desktop', () => {
        const typeInfo = detectDeviceType(uaStrings.ie10.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(!typeInfo.isProbablyMobileOrTablet);
    });

    it('ie 11 desktop', () => {
        const typeInfo = detectDeviceType(uaStrings.ie11.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(!typeInfo.isProbablyMobileOrTablet);
    });

    it('random', () => {
        const typeInfo = detectDeviceType(uaStrings.random.toLowerCase());
        assert(!typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(!typeInfo.isProbablyTablet);
        assert(!typeInfo.isProbablyMobileOrTablet);
    });
});

describe('Device type middleware', () => {
    it('should append device to res.locals', () => {
        const req = {
            headers: { 'user-agent': uaStrings.ipad },
        };
        const res = { locals: {} };
        deviceType(req, res, () => {});
        assert(res.locals.deviceType);
        const typeInfo = res.locals.deviceType;
        assert(typeInfo.isProbablyIos);
        assert(!typeInfo.isProbablyAndroid);
        assert(!typeInfo.isProbablyMobile);
        assert(typeInfo.isProbablyTablet);
        assert(typeInfo.isProbablyMobileOrTablet);
    });
});
