const showHighScore = {
    initialRouteName: 'Highscore',
};

const showImagePreview = {
    initialRouteName: 'ImagePreview',
};

export const newChallenge = username => ({
    contents: {
        en: `AIAIA, are you ready?😱`,
    },
    headings: {
        en: `${username} just gave you a challenged you!`,
    },
});
export const newWorkout = username => ({
    contents: {
        en: `${username} has just finished a workout. Approve his session now to compete for his bananas 🍌`,
    },
    headings: {
        en: 'Hurry up! - compete for 🍌',
    },
    data: {
        ...showImagePreview,
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
        ...showHighScore,
    },
});
export const declinedWorkout = declinedPersonName => ({
    contents: {
        en: `Your training just got declined!`,
    },
    headings: {
        en: `💩💩💩💩! ${declinedPersonName} declined your training`,
    },
});
