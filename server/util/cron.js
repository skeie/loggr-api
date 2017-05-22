const CronJob = require('cron').CronJob;
const UserService = require('../users/userService');
const ImageService = require('../images/imageService');
const imageService = new ImageService();
const userService = new UserService();

const deleteStreak = () => {
    try {
        const job = new CronJob(
            '0 0 0 * * 6',
            async () => {
                console.log('running cron');
                const allUsers = await userService.getAllUsers();
                allUsers.forEach(async user => {
                    const imagesApproved = await imageService.imagesApproveThisWeek(
                        user.id,
                    );
                    console.log(
                        `should delete ${user.name}'s streak? weekly training: ${user.weekly_training} - images approved this week: ${imagesApproved}`,
                    );

                    if (user.weekly_training > imagesApproved) {
                        userService.setStreakToNull(user.id);
                    }
                });
            },
            null,
            true,
            'Europe/Berlin',
        );
        job.start();
    } catch (ex) {
        console.log('cron pattern not valid');
    }
};

module.exports = deleteStreak;
