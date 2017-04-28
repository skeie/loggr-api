class Dao {
    constructor(db, dao) {
        this.db = db || require('../lib/dbConnection').db;
        const CommonDao = dao || require('../common/dao');
        this.commonDao = new CommonDao();
    }

    postImageUrl = (url, senderId, receiverId) => {
        return this.db
            .none(
                'INSERT INTO images(url, sender_user_id, receiver_user_id) VALUES($1, $2, $3)',
                [url, senderId, receiverId],
            )
            .then(() => {})
            .catch(error => {
                console.log('error in postingImageUrl', error);
                return error;
            });
    };

    getUnSeenImage = userId => {
        return this.db
            .any(
                'select url, image, images.id from images left JOIN users s on (s.id = images.sender_user_id) where receiver_user_id = $1 and has_seen = false and is_declined = false;',
                [userId],
            )
            .catch(error => {
                console.log('error in getUnSeenImages');
                return error;
            });
    };

    setImageDecline = imageId =>
        this.db.one(
            `update images set is_declined = true where id = $1 RETURNING sender_user_id as "senderUserId"`,
            [imageId],
        );

    setImageSeen = id => {
        return this.db
            .any('update images set has_seen = true where id = $1;', [id])
            .catch(error => {
                console.log('error in setImageSeen', error);
                return error;
            });
    };

    getSenderId = imageId => {
        return this.db
            .one(
                `select sender_user_id as "senderUserId" from images where id=$1`,
                [imageId],
            )
            .catch(error => {
                console.log('error in setImageSeen', error);
                return error;
            });
    };
    isFirstToSeeImage = imageId =>
        this.db
            .one(
                'select name from images left join users s on (s.id = images.receiver_user_id) where url = (select url from images where id = $1) and is_first_to_approve = true',
                [imageId],
            )
            .catch(error => {
                console.log('error in isFirstToSeeImage', error);
                return error;
            });

    imagesApproveThisWeek = userId => {
        return this.db
            .one(
                `SELECT count(DISTINCT url) from images where to_char(created::date, 'IYYY_IW') = to_char(now()::date, 'IYYY_IW') and has_seen = true and sender_user_id = $1;`,
                [userId],
            )
            .then(({ count }) => parseInt(count, 10))
            .catch(error => {
                console.log('error in imagesApproveThisWeek', error);
                return error;
            });
    };

    setFirstToSeeImage = imageId => {
        this.db
            .none(
                'update images set is_first_to_approve = true where id = $1',
                [imageId],
            )
            .catch(err => {
                console.log('error in setFirstToSeeImage', err);
                return err;
            });
    };
}

module.exports = Dao;
