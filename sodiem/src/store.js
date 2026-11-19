import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './features/coursesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveCourses } from './storage';

const initialSaved = loadSaved();
export const hasSaved = initialSaved !== null;

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    goal: goalReducer,
  },
  preloadedState: {
    courses: initialSaved ?? [],
  },
});

let previousCourses = store.getState().courses;
store.subscribe(() => {
  const currentCourses = store.getState().courses;
  if (currentCourses !== previousCourses) {
    previousCourses = currentCourses;
    saveCourses(currentCourses);
  }
});