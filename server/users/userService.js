const jwtToken = require("../util/jwtToken");

export default class Service {
  constructor(dao, commonDao) {
    const userDAO = dao || require("./userDAO");
    const CommonDao = commonDao || require("../common/dao");
    this.dao = new userDAO();
    this.commonDao = new CommonDao();
  }

  createUser = user => {
    return this.dao.getUser(user.email).then(ourUser => {
      if (!ourUser.image)
        this.commonDao.update(ourUser.id, { image: user.url }, "users");
      return Boolean(ourUser)
        ? { ...ourUser, jwtToken: jwtToken.generateToken(ourUser) }
        : this.dao.createUser(user).then(id => ({
            ...user,
            id,
            jwtToken: jwtToken.generateToken({ ...user, id })
          }));
    });
  };
}
