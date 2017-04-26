class Service {
    constructor(dao, commonDao, guildService, pushService, userService) {
        const imageDao = dao || require('./imageDao');
        const CommonDao = commonDao || require('../common/dao');
        const GuildService = guildService || require('../guilds/guildService');
        const PushService =
            pushService ||
            require('../pushNotification/pushNotificationsService');
        const UserService = userService || require('../users/userService');
        this.dao = new imageDao();
        this.commonDao = new CommonDao();
        this.guildService = new GuildService();
        this.pushService = new PushService();
        this.userService = new UserService();
    }

    postImageUrl = async (url, userId) => {
        const guild = await this.guildService.findGuildBasedOnUserid(userId);
        guild.users.forEach(receiverUserId => {
            if (receiverUserId !== userId) {
                this.dao.postImageUrl(url, userId, receiverUserId);
            }
        });
        this.pushService.sendPushToGuild(userId);
    };

    imagesApproveThisWeek = userId => this.dao.imagesApproveThisWeek(userId);

    _increaseStreak = async (userId, imageId, hasSomeoneSeenImage) => {
        const [numberOfApprovedImages, { senderUserId }] = await Promise.all([
            this.imagesApproveThisWeek(userId),
            this.dao.getSenderId(imageId),
        ]);

        return this.userService.increaseStreak(
            numberOfApprovedImages,
            senderUserId,
        );
    };
    setImageSeen = async (imageId, userId) => {
        let score = 0;
        let hasSomeoneSeenImage = await this.dao.isFirstToSeeImage(imageId);
        hasSomeoneSeenImage = Boolean(hasSomeoneSeenImage.length);
        this.dao.setImageSeen(imageId);
        if (!hasSomeoneSeenImage)
            score = await this._increaseStreak(
                userId,
                imageId,
                hasSomeoneSeenImage,
            );
        return Promise.resolve({ hasSomeoneSeenImage, score });
    };

    getUnSeenImage = async id => {
        const [unSeenImage, numberOfImages] = await Promise.all([
            this.dao.getUnSeenImage(id),
            this.imagesApproveThisWeek(id),
        ]);

        return { images: [...unSeenImage], numberOfImages };
    };
}

module.exports = Service;
