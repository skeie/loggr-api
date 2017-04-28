const jwtToken = require('../util/jwtToken');
const pushUtil = require('../pushNotification/pushUtil');
class Service {
    constructor(dao, commonDao) {
        const userDAO = dao || require('./userDAO');
        const CommonDao = commonDao || require('../common/dao');
        const HighscoreService = require('../highscore/highscoreService');
        const GuildService = require('../guilds/guildService');
        const PushService = require('../pushNotification/pushNotificationsService');
        this.pushService = new PushService(this);
        this.highscoreService = new HighscoreService();
        this.guildService = new GuildService();
        this.dao = new userDAO();
        this.commonDao = new CommonDao();
    }

    getUserById = userId => {
        return this.dao.getUserById(userId);
    };

    increaseStreak = async (numberOfApprovedImages, userId, approvedUserId) => {
        const { weeklyTraining, streak } = await this.dao.getUserById(userId);

        let score = streak > 1
            ? streak * numberOfApprovedImages
            : numberOfApprovedImages;

        if (weeklyTraining === numberOfApprovedImages) {
            this.dao.incrementStreak(userId);
        }

        if (weeklyTraining < numberOfApprovedImages) {
            score = 1;
        }

        this.highscoreService.update(userId, score);
        const content = this._generateContent(score);
        this.pushService.sendPushToOne(userId, content, approvedUserId);
        return Promise.resolve(score);
    };

    _generateContent = score => name => pushUtil.approvedWorkout(score, name);

    getUserPushToken = userId => this.dao.getUserPushToken(userId);
    createUser = async loggedInUser => {
        const user = await this.dao.getUserWithEmail(loggedInUser.email);
        if (Boolean(user)) {
            this.commonDao.update(user.id, loggedInUser, 'users');
            return { ...user, jwtToken: jwtToken.generateToken(user) };
        } else {
            const id = await this.dao.createUser(loggedInUser);
            this.highscoreService.create(id);
            this.guildService.addUserToGuild(id, 1);
            return {
                loggedInUser,
                id,
                jwtToken: jwtToken.generateToken({ ...user, id }),
            };
        }
    };
}

module.exports = Service;
