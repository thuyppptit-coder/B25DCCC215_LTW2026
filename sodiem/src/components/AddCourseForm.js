import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, CREDIT_OPTIONS } from '../data';
import { addCourse, selectCourses } from '../features/coursesSlice';
import { useNotice } from '../context/NoticeContext';

const AddCourseForm = () => {
    const courses = useSelector(selectCourses);
    const dispatch = useDispatch();
    const showNotice = useNotice();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [credits, setCredits] = useState(3);
    const [semester, setSemester] = useState(SEMESTERS[0]);
    const [score, setScore] = useState('');
    const [errors, setErrors] = useState({});

    const codeInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        const trimmedCode = code.trim();
        const trimmedName = name.trim();
        const numScore = Number(score);

        if (!trimmedCode) {
            newErrors.code = 'Hãy nhập mã môn';
        } else if (courses.some((c) => c.code.toLowerCase() === trimmedCode.toLowerCase())) {
            newErrors.code = 'Mã môn đã tồn tại';
        }

        if (!trimmedName) {
            newErrors.name = 'Hãy nhập tên môn';
        }

        if (score === '' || Number.isNaN(numScore) || numScore < 0 || numScore > 10) {
            newErrors.score = 'Điểm phải từ 0 đến 10';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        dispatch(
            addCourse({
                code: trimmedCode.toUpperCase(),
                name: trimmedName,
                credits: Number(credits),
                semester,
                score: numScore,
            })
        );
        showNotice(`Đã thêm môn ${trimmedName}`);

        setCode('');
        setName('');
        setCredits(3);
        setSemester(SEMESTERS[0]);
        setScore('');
        setErrors({});
        if (codeInputRef.current) {
            codeInputRef.current.focus();
        }
    };

    return (
        <section>
            <h2>Thêm môn học</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="course-code">Mã môn</label>
                    <input
                        id="course-code"
                        ref={codeInputRef}
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    {errors.code && (
                        <span className="error-msg" role="alert">
                            {errors.code}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="course-name">Tên môn</label>
                    <input
                        id="course-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                        <span className="error-msg" role="alert">
                            {errors.name}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="course-credits">Số tín chỉ</label>
                    <select
                        id="course-credits"
                        value={credits}
                        onChange={(e) => setCredits(Number(e.target.value))}
                    >
                        {CREDIT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="course-semester">Học kỳ</label>
                    <select
                        id="course-semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    >
                        {SEMESTERS.map((sem) => (
                            <option key={sem} value={sem}>
                                {sem}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="course-score">Điểm hệ 10</label>
                    <input
                        id="course-score"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                    />
                    {errors.score && (
                        <span className="error-msg" role="alert">
                            {errors.score}
                        </span>
                    )}
                </div>

                <button type="submit">Thêm môn</button>
            </form>
        </section>
    );
};

export default AddCourseForm;