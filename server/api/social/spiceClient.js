const axios = require('axios');

const putSpiceOnVenue = (id, venue) => {
    // logger.debug({ what: 'putSpiceOnVenue()', id, venue });
    // const url = 'http://localhost:8002/api/v1/spices/putSpicesOnVenue'; // TODO add config here
    // return axios.post(url, {
    //     venueId: id,
    //     venue: venue,
    //     force: true
    // })
    //     .then((res) => {
    //         return res.data;
    //     })
    //     .catch((err) => {
    //         logger.warn({ what: 'putSpiceOnVenue()-failed', err: err });
    //         throw err;
    //     });
    return Promise.resolve();
};

module.exports = {
    putSpiceOnVenue,
};
