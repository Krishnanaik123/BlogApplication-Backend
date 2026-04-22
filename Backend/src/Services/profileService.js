const profileRepo = require('../Models/profileRepo');

const getUserData = async (userId) => {
    return await profileRepo.findUserById(userId);
};

module.exports = { getUserData };