const STORAGE_KEY = 'ltw_sodiem_courses';

export const loadSaved = () => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

export const saveCourses = (courses) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
        // Bỏ qua lỗi lưu trữ
    }
};