import groupBy from "lodash/groupBy";

export const exercisesMapper = (exercises, workoutExercises = []) => {
  const grouped = groupBy(exercises, exercise => exercise.exercise_id);
  const array = Object.keys(grouped).map(key => grouped[key]);
  const sorted = array.sort(
    (a, b) => new Date(b[0].updated) - new Date(a[0].updated)
  );

  return sorted.map(element => {
    return {
      id: element[0].exercise_id,
      metaData: "",
      name: element[0].name,
      sets: element,
      isInWorkout: workoutExercises.some(workoutExercise => workoutExercise.id === element[0].exercise_id)
    };
  });
};

export const exerciseMapper = exercise => {
  const returnExercise = {
    id: exercise[0].exerciseId,
    name: exercise[0].name,
    metaData: exercise[0].body
  };

  returnExercise.sets = exercise.sort((a, b) => a.index > b.index);
  return returnExercise;
};
