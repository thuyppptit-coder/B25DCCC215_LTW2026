import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SEMESTERS, GRADES } from './data';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { getGrade, calcStats } from './utils';
import { setCourses, removeCourse, setScore, selectCourses } from './features/coursesSlice';
import { hasSaved } from './store';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import CourseRow from './components/CourseRow';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = "gp-4073";

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [semesterFilter, setSemesterFilter] = useLocalStorage('ltw_sodiem_semester', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const searchInputRef = useRef(null);
  const didInitialLoadRef = useRef(hasSaved);

  useEffect(() => {
    if (!didInitialLoadRef.current && data) {
      didInitialLoadRef.current = true;
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  const semesterCourses = useMemo(() => {
    if (semesterFilter === 'all') return courses;
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const displayedCourses = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) return semesterCourses;
    return semesterCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) || c.code.toLowerCase().includes(keyword)
    );
  }, [semesterCourses, debouncedSearch]);

  const currentStats = useMemo(() => calcStats(semesterCourses), [semesterCourses]);
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  const gradeDistribution = useMemo(() => {
    return GRADES.map((g) => {
      const count = semesterCourses.filter((c) => getGrade(c.score).letter === g.letter).length;
      return { letter: g.letter, count };
    });
  }, [semesterCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${cumulativeStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, cumulativeStats.gpa]);

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTypingField = tag === 'input' || tag === 'select' || tag === 'textarea';

      if (e.key === '/' && !isTypingField) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCourseShift = (e) => {
    setSearch(e.target.value);
  };

  const handleScoreChange = useCallback(
    (id, e) => {
      const val = e.target.valueAsNumber;
      if (!Number.isNaN(val) && val >= 0 && val <= 10) {
        dispatch(setScore({ id, score: val }));
      }
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (course) => {
      dispatch(removeCourse(course.id));
      showNotice(`Đã xóa môn ${course.name}`);
    },
    [dispatch, showNotice]
  );

  const handleResetSample = () => {
    if (data) {
      dispatch(setCourses(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  const showLoading = !hasSaved && loading && courses.length === 0;
  const showError = !hasSaved && error && courses.length === 0;

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <div className="container">
        <header>
          <h1>Sổ điểm sinh viên</h1>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </button>
        </header>

        {showLoading && <p>Đang tải bảng điểm...</p>}
        {showError && <p>Không tải được bảng điểm</p>}

        {!showLoading && !showError && (
          <>
            <section>
              <h2>Thống kê</h2>
              <p>Số môn: {currentStats.count}</p>
              <p>Tổng tín chỉ: {currentStats.credits}</p>
              <p>GPA (hệ 4): {currentStats.gpa.toFixed(2)}</p>
              <p>Xếp loại: {currentStats.rank}</p>
              <p>GPA tích lũy: {cumulativeStats.gpa.toFixed(2)}</p>

              <h3>Phân bố điểm chữ</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {gradeDistribution.map((item) => (
                  <li
                    key={item.letter}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                  >
                    <span>
                      {item.letter}: {item.count}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#2563eb',
                        height: '10px',
                        width: `${24 * item.count}px`,
                      }}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Bảng điểm</h2>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
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

                <div>
                  <label htmlFor="search-course">Tìm môn học: </label>
                  <input
                    id="search-course"
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tên hoặc mã môn (/)"
                    value={search}
                    onChange={handleCourseShift}
                  />
                </div>
              </div>

              <p>Tìm thấy {displayedCourses.length} môn</p>

              {displayedCourses.length === 0 ? (
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
                      <th>Số lần render</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCourses.map((course) => (
                      <CourseRow
                        key={course.id}
                        course={course}
                        onScore={handleScoreChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ marginTop: 12 }}>
                <button type="button" onClick={handleResetSample}>
                  Đặt lại dữ liệu mẫu
                </button>
              </div>
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
