const config = require('../util/config');
const fetch = require('../util/util');
const Guildservice = require('../guilds/guildService');
const UserService = require('../users/userService');

const newWorkout = username =>
    `Hurry up! ${username} has just finished a workout. Approve his session now to compete for his bananas 🍌`;
const approvedWorkout = amount =>
    `Yay! Your training got just got approved. You just recieved 
${amount} new banans 🍌!!`;
class Service {
    constructor(userService) {
        this.guildservice = new Guildservice();
        this.userService = userService || new UserService();
    }
    _generateMessage = (userId, text) => ({
        include_player_ids: [userId],
        app_id: config.onesignalAppId,
        contents: {
            en: text,
        },
    });
    _sendPush = (userId, text) => {
        fetch.post(config.onesignalUrl, this._generateMessage(userId, text), config.onesignalAuth);
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
    sendPushToOne = async (userId, amount) => {
        const { pushToken } = await this.userService.getUserPushToken(userId);
        this._sendPush(pushToken, approvedWorkout(amount));
    };
}
module.exports = Service;