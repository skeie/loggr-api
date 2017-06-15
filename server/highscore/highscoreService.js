class Service {
    constructor(dao, commonDao) {
        const HighscoreDao = dao || require('./highscoreDao');
        const CommonDao = commonDao || require('../common/dao');
        const GuildService = require('../guilds/guildService');
        this.dao = new HighscoreDao();
        this.commonDao = new CommonDao();
        this.guildService = new GuildService();
    }

    update = (userId, amount) => {
        return this.dao.update(userId, amount);
    };

    getAll = async ({ user }) => {
        const userId = user.id;
        const { users } = await this.guildService.findGuildBasedOnUserid(
            userId,
        );

        const [highscore, userHighScore] = await Promise.all([
            this.dao.getHighScoreBasedOnGuild(users),
            this.dao.get(userId),
        ]);

        return { highscores: highscore, ...userHighScore };
    };

    create = userId => {
        return this.dao.create(userId);
    };
}

module.exports = Service;
