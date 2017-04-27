const showHighScore = {
    initialRouteName: 'Highscore',
};

const showImagePreview = {
    initialRouteName: 'ImagePreview',
};

export const newWorkout = username => ({
    contents: {
        en: `${username} has just finished a workout. Approve his session now to compete for his bananas 🍌`,
    },
    headings: {
        en: 'Hurry up! - compete for 🍌',
    },
    data: {
        showHighScore,
    },
});
export const approvedWorkout = (amount, approvedPersonName) => ({
    contents: {
        en: `Yay! Your training just got approved. You just recieved ${amount} new banans 🍌!!`,
    },
    headings: {
        en: `${approvedPersonName} approved your training`,
    },
    data: {
        showImagePreview,
    },
});
export const declinedWorkout = declinedPersonName => ({
    contents: {
        en: `Your training just got declined. Try again!`,
    },
    headings: {
        en: `💩💩💩💩! ${declinedPersonName} declined your training`,
    },
    data: {
        showImagePreview,
    },
});
