const getPostRouteQuery = 'insert into routes (title, description, anyone_can_edit, active) values ($1, $2, $3, $4) returning id';

module.exports = {
    getPostRouteQuery,
};
