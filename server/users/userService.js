const jwtToken = require("../util/jwtToken");

export default class Service {
  constructor(dao, commonDao) {
    const userDAO = dao || require("./userDAO");
    const CommonDao = commonDao || require("../common/dao");
    const HighscoreService = require("../highscore/highscoreService");
    this.highscoreService = new HighscoreService();
    this.dao = new userDAO();
    this.commonDao = new CommonDao();
  }

  getUserById = userId => {
    return this.dao.getUserById(userId);
  }

  createUser = user => {
    return this.dao.getUserWithEmail(user.email).then(ourUser => {
      if (Boolean(ourUser)) {
        this.highscoreService.create(ourUser.id, true); //legazy, remove me
        return { ...ourUser, jwtToken: jwtToken.generateToken(ourUser) };
      } else {
        return this.dao.createUser(user).then(id => {
          this.highscoreService.create(id);
          return {
            ...user,
            id,
            jwtToken: jwtToken.generateToken({ ...user, id })
          };
        });
      }
    });
  };
}
