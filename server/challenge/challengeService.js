class ChallengeService {
    constructor() {
        const Dao = require('./challengeDAO');
        this.dao = new Dao();
    }

    getActiveChallenge = data => this.dao.getActiveChallenge(data);

    putChallenge = data => this.dao.putChallenge(data);
}
