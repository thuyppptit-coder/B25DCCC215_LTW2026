import { GRADES, RANKS } from './data';

export const getGrade = (score) => {
    return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
};

export const getRank = (gpa) => {
    const found = RANKS.find((r) => gpa >= r.min);
    return found ? found.title : 'Yếu';
};

export const calcStats = (courses) => {
    if (!courses || courses.length === 0) {
        return {
            count: 0,
            credits: 0,
            points: 0,
            gpa: 0,
            rank: 'Chưa xếp loại',
        };
    }

    const { credits, points } = courses.reduce(
        (acc, course) => {
            const grade = getGrade(course.score);
            return {
                credits: acc.credits + course.credits,
                points: acc.points + course.credits * grade.point,
            };
        },
        { credits: 0, points: 0 }
    );

    const rawGpa = credits > 0 ? points / credits : 0;
    const gpa = Math.round(rawGpa * 100) / 100;
    const rank = getRank(gpa);

    return {
        count: courses.length,
        credits,
        points,
        gpa,
        rank,
    };
};