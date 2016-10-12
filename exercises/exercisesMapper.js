export const exercisesMapper = exercises => {

  const newExercise = [];
  exercises.forEach(exercise => {
    const {user_id, created, ...rest} = exercise;
    let current = newExercise[rest.id] || {};


    current.sets = current.sets || [];
    current.id = rest.id;
    current.metaData = rest.body;
    
    current.name = rest.name;
    current.sets[rest.index] = rest.amount || 0;
    newExercise[rest.id] = current;
    });
    return newExercise.filter(element => element);
}

export const exerciseMapper = exercise => {
  let sets = [];
  let returnExercise = {};
  exercise.forEach(element => {
    returnExercise.id = element.id;
    returnExercise.name = element.name;
    returnExercise.metaData = element.body;
    sets[element.index] = element.amount;
  });
  returnExercise.sets = sets;
  return returnExercise;
};

