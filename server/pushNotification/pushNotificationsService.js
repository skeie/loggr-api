const config = require('../util/config');
const fetch = require('../util/util');
const Guildservice = require('../guilds/guildService');
const UserService = require('../users/userService');

const showHighScore = {
    showHighScore: true,
};

const newWorkout = username => ({
    contents: {
        en: `${username} has just finished a workout. Approve his session now to compete for his bananas 🍌`,
    },
    headings: {
        en: 'Hurry up! - compete for 🍌',
    },
});
const approvedWorkout = (amount, approvedPersonName) => ({
    contents: {
        en: `Yay! Your training just got approved. You just recieved ${amount} new banans 🍌!!`,
    },
    headings: {
        en: `${approvedPersonName} approved your training`,
    },
});
class Service {
    constructor(userService) {
        this.guildservice = new Guildservice();
        this.userService = userService || new UserService();
    }
    _generateMessage = (userId, content, data = {}) => ({
        include_player_ids: [userId],
        app_id: config.onesignalAppId,
        ...content,
        data,
    });
    _sendPush = (userId, content, obj) => {
        fetch.post(
            config.onesignalUrl,
            this._generateMessage(userId, content, obj),
            config.onesignalAuth,
        );
    };
    sendPushToGuild = async userId => {
        const guild = await this.guildservice.findGuildBasedOnUserid(userId);
        const userWithTraining = await this.userService.getUserById(userId);
        const pushTokens = await Promise.all(
            guild.users.map(
                currentUserId =>
                    currentUserId !== userId &&
                    this.userService.getUserPushToken(currentUserId),
            ),
        );
        pushTokens.forEach(
            ({ pushToken }) =>
                pushToken &&
                this._sendPush(pushToken, newWorkout(userWithTraining.name)),
        );
    };
    sendPushToOne = async (userId, amount, approvedPersonName) => {
        const { pushToken, name } = await this.userService.getUserPushToken(
            userId,
        );
        this._sendPush(
            pushToken,
            approvedWorkout(amount, approvedPersonName),
            showHighScore,
        );
    };
}
module.exports = Service;
