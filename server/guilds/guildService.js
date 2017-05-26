class Service {
    constructor(dao, commonDao) {
        const guildDao = dao || require('./guildDao');
        this.dao = new guildDao();
    }

    findGuildBasedOnUserid = id => {
        return this.dao.findGuildBasedOnUserid(id);
    };

    addUserToGuild = (userId, guildId) =>
        this.dao.addUserToGuild(userId, guildId);
    getAllGuilds = () => this.dao.getAllGuilds();
}

module.exports = Service;
