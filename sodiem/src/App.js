import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, formatPoint } from './data';
import { useFetch } from './hooks/useFetch';
import { getGrade, calcStats } from './utils';
import { setCourses, removeCourse, setScore, selectCourses } from './features/coursesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [semesterFilter, setSemesterFilter] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  const filteredCourses = useMemo(() => {
    if (semesterFilter === 'all') return courses;
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const currentStats = useMemo(() => calcStats(filteredCourses), [filteredCourses]);
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  const handleScoreChange = (id, e) => {
    const val = e.target.valueAsNumber;
    if (!Number.isNaN(val) && val >= 0 && val <= 10) {
      dispatch(setScore({ id, score: val }));
    }
  };

  const handleRemove = (course) => {
    dispatch(removeCourse(course.id));
    showNotice(`Đã xóa môn ${course.name}`);
  };

  return (
    <div className={`app ${theme}`} data-build="TH03">
      <div className="container">
        <header>
          <h1>Sổ điểm sinh viên</h1>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
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
                            <button type="button" onClick={() => handleRemove(course)}>
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

            <AddCourseForm />
            <GoalPlanner />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
