const CREATE = 'INSERT INTO routes (title, description, active) values ($1, $2, TRUE) RETURNING id';

module.exports = {
    CREATE,
};
