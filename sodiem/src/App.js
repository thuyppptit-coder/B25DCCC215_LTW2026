import React, { useReducer, useEffect, useState, useMemo, useRef } from 'react';
import { SEMESTERS, CREDIT_OPTIONS, formatPoint } from './data';
import { useFetch } from './hooks/useFetch';
import { getGrade, calcStats } from './utils';
import { coursesReducer } from './coursesReducer';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [semesterFilter, setSemesterFilter] = useState('all');

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (semesterFilter === 'all') return courses;
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const currentStats = useMemo(() => calcStats(filteredCourses), [filteredCourses]);
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  const handleScoreChange = (id, e) => {
    const val = e.target.valueAsNumber;
    if (!Number.isNaN(val) && val >= 0 && val <= 10) {
      dispatch({ type: 'SET_SCORE', payload: { id, score: val } });
    }
  };

  const handleAddCourse = (e) => {
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

    dispatch({
      type: 'ADD',
      payload: {
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
        credits: Number(credits),
        semester,
        score: numScore,
      },
    });

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
    <div className="app light" data-build="TH03">
      <div className="container">
        <header>
          <h1>Sổ điểm sinh viên</h1>
        </header>

        {loading && <p>Đang tải bảng điểm...</p>}
        {error && <p>Không tải được bảng điểm</p>}

        {!loading && !error && (
          <>
            <section>
              <h2>Thống kê</h2>
              <p>Số môn: {currentStats.count}</p>
              <p>Tổng tín chỉ: {currentStats.credits}</p>
              <p>GPA (hệ 4): {currentStats.gpa.toFixed(2)}</p>
              <p>Xếp loại: {currentStats.rank}</p>
              <p>GPA tích lũy: {cumulativeStats.gpa.toFixed(2)}</p>
            </section>

            <section>
              <h2>Bảng điểm</h2>
              <div>
                <label htmlFor="semester-select">Xem học kỳ: </label>
                <select
                  id="semester-select"
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              {filteredCourses.length === 0 ? (
                <p>Chưa có môn học nào</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Mã môn</th>
                      <th>Tên môn</th>
                      <th>Tín chỉ</th>
                      <th>Học kỳ</th>
                      <th>Điểm (hệ 10)</th>
                      <th>Điểm chữ</th>
                      <th>Điểm (hệ 4)</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => {
                      const grade = getGrade(course.score);
                      const isFail = grade.letter === 'F';
                      return (
                        <tr key={course.id} className={isFail ? 'fail-row' : ''}>
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
                              onChange={(e) => handleScoreChange(course.id, e)}
                            />
                          </td>
                          <td>{isFail ? 'F – Học lại' : grade.letter}</td>
                          <td>{formatPoint(grade.point)}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'REMOVE', payload: course.id })}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>

            <section>
              <h2>Thêm môn học</h2>
              <form onSubmit={handleAddCourse} noValidate>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
