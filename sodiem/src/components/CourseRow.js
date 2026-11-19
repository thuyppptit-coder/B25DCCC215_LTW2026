import React, { useRef } from 'react';
import { formatPoint } from '../data';
import { getGrade } from '../utils';

const CourseRow = React.memo(({ course, onScore, onRemove }) => {
    const renderCountRef = useRef(0);
    renderCountRef.current += 1;

    const grade = getGrade(course.score);
    const isFail = grade.letter === 'F';

    return (
        <tr className={isFail ? 'fail-row' : ''}>
            <td>{course.code}</td>
            <td>{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.semester}</td>
            <td>
                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    aria-label={`Điểm ${course.name}`}
                    value={course.score}
                    onChange={(e) => onScore(course.id, e)}
                />
            </td>
            <td>{isFail ? 'F – Học lại' : grade.letter}</td>
            <td>{formatPoint(grade.point)}</td>
            <td>{renderCountRef.current}</td>
            <td>
                <button type="button" onClick={() => onRemove(course)}>
                    Xóa
                </button>
            </td>
        </tr>
    );
});

export default CourseRow;