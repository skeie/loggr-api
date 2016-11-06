const User = require('./UserModel');

class ExampleModel {
    constructor({ title, city, userId }) {
        this._title = title || '';
        this._city = city;
        this._user = new User({ id: userId });
    }

    get title() { return this._title; }
    get city() { return this._city; }
    get user() { return this._user; }
}

module.exports = ExampleModel;
