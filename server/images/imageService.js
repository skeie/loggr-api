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
        this.pushUtil = require('../pushNotification/pushUtil');
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
        const { senderUserId } = await this.dao.getSenderId(imageId);
        const numberOfApprovedImages = await this.imagesApproveThisWeek(
            senderUserId,
        );

        return this.userService.increaseStreak(
            numberOfApprovedImages,
            senderUserId,
            userId,
        );
    };
    setImageSeen = async (imageId, userId) => {
        let score = 0;
        let hasSomeoneSeenImage = await this.dao.isFirstToSeeImage(imageId);
        this.dao.setImageSeen(imageId);

        if (!hasSomeoneSeenImage) {
            this.dao.setFirstToSeeImage(imageId);
            score = await this._increaseStreak(
                userId,
                imageId,
                hasSomeoneSeenImage,
            );
        }
        return Promise.resolve({ hasSomeoneSeenImage, score });
    };

    getUnSeenImage = async id => {
        const [unSeenImage, numberOfImages] = await Promise.all([
            this.dao.getUnSeenImage(id),
            this.imagesApproveThisWeek(id),
        ]);

        return { images: [...unSeenImage], numberOfImages };
    };

    setImageDecline = async (imageId, userId) => {
        const { senderUserId } = await this.dao.setImageDecline(imageId);
        const contentReference = this.pushUtil.declinedWorkout;
        this.pushService.sendPushToOne(senderUserId, contentReference, userId);
    };
}

module.exports = Service;
