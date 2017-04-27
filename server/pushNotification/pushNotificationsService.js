const config = require('../util/config');
const fetch = require('../util/util');
const Guildservice = require('../guilds/guildService');
const UserService = require('../users/userService');
const pushUtil = require('./pushUtil');

class Service {
    constructor(userService) {
        this.guildservice = new Guildservice();
        this.userService = userService || new UserService();
    }
    _generateMessage = (userId, content) => ({
        include_player_ids: [userId],
        app_id: config.onesignalAppId,
        ...content,
    });
    _sendPush = (userId, content) => {
        fetch.post(
            config.onesignalUrl,
            this._generateMessage(userId, content),
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
                this._sendPush(
                    pushToken,
                    pushUtil.newWorkout(userWithTraining.name),
                ),
        );
    };
    sendPushToOne = async (userGettingPushId, content, userThatDidActionId) => {
        const [{ pushToken }, { name }] = await Promise.all([
            this.userService.getUserPushToken(userGettingPushId),
            this.userService.getUserById(userThatDidActionId),
        ]);

        content = content(name);
        this._sendPush(pushToken, content);
    };
}
module.exports = Service;
