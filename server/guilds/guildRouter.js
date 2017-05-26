const express = require('express');
const router = express.Router();
const Service = require('./guildService');
const auth = require('../util/jwtToken');
const guildService = new Service();
const requireToken = auth.requireAuth();

const addUserToGuild = (req, res, next) => {};

const getAllGuilds = async (req, res, next) => {
    const guilds = await guildService.getAllGuilds();
    res.json(guilds);
};

router.post('/', addUserToGuild);
router.get('/', getAllGuilds);

module.exports = router;
