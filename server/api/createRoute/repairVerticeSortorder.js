function correctVerticeSortorder (vertices) {
    return vertices
        // sort by sortorder, so we get 
        // vertices in the order that the user wants
        .sort((v1, v2) => v1.sortorder - v2.sortorder)

        // overwrite existing sortorder,
        // so we guarantee 1, 2, ...n sequence.
        // and we ensure that we respect the user's
        // required sortorder due to previous sort
        .map((vertice, i) => {
            return Object.assign({}, vertice, { sortorder: i + 1 });
        });
}

module.exports = correctVerticeSortorder;