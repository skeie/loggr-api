class ChallengeDAO {
    constructor({ db }) {
        this.db = db || require('../lib/dbConnection').db;
    }

    putChallenge = ({ challengedUserId, userSentChallengeId, title }) =>
        this.db
            .none(
                'insert into challenge (challenged_user_id, user_sent_challenge_id, title) values($1, $2, $3)',
                [challengedUserId, userSentChallengeId, title],
            )
            .catch(e => console.error('error in putChallenge', e));

    getActiveChallenge = ({ userId }) =>
        this.db
            .any(
                `select title user_sent_challenge_id as userSentChallengeId from challenge where challenged_user_id = $1 and created >= NOW() - '1 day'::INTERVAL`,
                [userId],
            )
            .catch(e => console.error('error in getActive challenge', e));
}

module.exports = ChallengeDAO;
