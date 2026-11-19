import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
    name: 'courses',
    initialState: [],
    reducers: {
        setCourses: (_, action) => {
            return Array.isArray(action.payload) ? [...action.payload] : [];
        },
        addCourse: (state, action) => {
            const maxId = state.reduce((max, item) => (item.id > max ? item.id : max), 0);
            state.push({ ...action.payload, id: maxId + 1 });
        },
        removeCourse: (state, action) => {
            return state.filter((item) => item.id !== action.payload);
        },
        setScore: (state, action) => {
            const { id, score } = action.payload;
            const target = state.find((item) => item.id === id);
            if (target) {
                target.score = score;
            }
        },
    },
});

export const { setCourses, addCourse, removeCourse, setScore } = coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;