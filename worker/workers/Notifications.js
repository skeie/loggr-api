// these also represent the email_notifications_blacklist field
const notifications = {
    LIKE: 1,
    COMMENT: 2,
    NEW_ROUTE: 3,
    NEW_USER: 4,
    NEW_USER_PERSONAL_MAIL: 5
};


function getValue(notification) {
    return notifications[notification];
}

/**
 * Given value, find the key e.g value = 2 => COMMENT
 */
function getKey(value) {
    let key;
    Object.keys(notifications).forEach(_key => {
        if (notifications[_key] === value) {
            key = _key;
        }
    });

    if (!key) {
        throw new Error('notification key does not exist for value', value);
    }
    return key;
}

function isLegalNotificationKey (notification) {
    return Object.keys(notifications)
        .indexOf(notification) > -1;
}

module.exports = Object.assign({
    getValue,
    getKey,
    isLegalNotificationKey,
}, notifications);
