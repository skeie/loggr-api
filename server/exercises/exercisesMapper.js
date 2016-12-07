import { groupBy } from 'lodash';


export const exercisesMapper = exercises => {
  const grouped = groupBy(exercises, (exercise) => exercise.exercise_id);
  const array = Object.keys(grouped).map(key => grouped[key]);
  return array.map(element => {
    return {
      id: element[0].id,
      metaData: "",
      name: element[0].name,
      sets: element
    };
  });
}

export const exerciseMapper = exercise => {
  const returnExercise = {};
  exercise.map(element => {
    returnExercise.id = element.id;
    returnExercise.name = element.name;
    returnExercise.metaData = element.body;
  });
  returnExercise.sets = exercise;
  return returnExercise;
};

