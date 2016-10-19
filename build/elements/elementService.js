'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function Service(dao) {
  var _this = this;

  _classCallCheck(this, Service);

  this.postElement = function (element) {
    return _this.dao.postElement(element);
  };

  this.update = function (id, object, table) {
    return _this.dao.update(id, object, table);
  };

  var ElementDao = dao || require('./elementDao');
  this.dao = new ElementDao();
};

exports.default = Service;
//# sourceMappingURL=elementService.js.map