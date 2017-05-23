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
        // this.increaseStreak(10, 7, 9);
    }

    getUserById = userId => {
        return this.dao.getUserById(userId);
    };

    updateUser = (userId, data) => {
        this.commonDao.update(userId, data, 'users');
    };

    getAllUsers = () => this.dao.getAllUsers();

    setStreakToNull = userId => this.dao.setStreakToNull();

    increaseStreak = async (numberOfApprovedImages, userId, approvedUserId) => {
        const { weeklyTraining, streak } = await this.dao.getUserById(userId);

        let score = streak > 1
            ? streak * numberOfApprovedImages
            : numberOfApprovedImages;

        console.log(
            `Hva er score som brukeren får tilbake: ${score} - hva er number of approved images: ${numberOfApprovedImages}`,
        );

        if (weeklyTraining === numberOfApprovedImages) {
            this.dao.incrementStreak(userId);
        }

        if (weeklyTraining < numberOfApprovedImages) {
            score = 1;
        }

        this.highscoreService.update(userId, score);
        this.highscoreService.update(approvedUserId, score);
        const content = this._generateContent(score);
        this.pushService.sendPushToOne(userId, content, approvedUserId);
        return Promise.resolve(score);
    };

    _generateContent = score => name => pushUtil.approvedWorkout(score, name);

    getUserPushToken = userId => this.dao.getUserPushToken(userId);
    createUser = async loggedInUser => {
        const user = await this.dao.getUserWithEmail(loggedInUser.email);

        if (Boolean(user)) {
            this.updateUser(user.id, loggedInUser);
            return {
                ...user,
                ...loggedInUser,
                jwtToken: jwtToken.generateToken(user),
            };
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
