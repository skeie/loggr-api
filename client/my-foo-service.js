'use strict';

exports.bark = () => (
    'woff'
);

exports.animals = ['octopus', 'dog'];

exports.octopus = numArms => ({
    arms: numArms,
    defense: ['ink', 'speed'],
    hasBones: false,
});

