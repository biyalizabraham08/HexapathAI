import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CourseProgressContext = createContext();

const STORAGE_KEY = 'skillgap_course_progress';

/**
 * Course shape: {
 *   id: string,           // unique - generated from name+platform
 *   name: string,
 *   platform: string,
 *   duration: string,
 *   topic: string,
 *   type: string,         // 'Hard Skill' | 'Soft Skill'
 *   url: string,
 *   status: 'not_started' | 'in_progress' | 'completed',
 *   progress: number,     // 0-100
 *   startedAt: string|null,
 *   completedAt: string|null,
 * }
 */

export function CourseProgressProvider({ children }) {
  const [courses, setCourses] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  // Generate a stable ID from course name + platform
  const makeCourseId = (name, platform) =>
    `${(name || '').toLowerCase().replace(/\s+/g, '-')}_${(platform || '').toLowerCase().replace(/\s+/g, '-')}`;

  // Start a course (add to tracked list)
  const startCourse = useCallback((courseData) => {
    const id = makeCourseId(courseData.name || courseData.recommendation, courseData.platform);
    setCourses(prev => {
      if (prev.find(c => c.id === id)) return prev; // already tracked
      return [...prev, {
        id,
        name: courseData.name || courseData.recommendation,
        platform: courseData.platform || 'Unknown',
        duration: courseData.duration || '',
        topic: courseData.topic || '',
        type: courseData.type || '',
        url: courseData.url || '',
        status: 'in_progress',
        progress: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
      }];
    });
  }, []);

  // Update progress for a course
  const updateProgress = useCallback((courseId, progress) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const newProgress = Math.min(100, Math.max(0, progress));
      return {
        ...c,
        progress: newProgress,
        status: newProgress >= 100 ? 'completed' : 'in_progress',
        completedAt: newProgress >= 100 ? new Date().toISOString() : null,
      };
    }));
  }, []);

  // Mark course as complete
  const completeCourse = useCallback((courseId) => {
    updateProgress(courseId, 100);
  }, [updateProgress]);

  // Remove a course from tracking
  const removeCourse = useCallback((courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  }, []);

  // Check if a course is being tracked
  const isCourseTracked = useCallback((name, platform) => {
    const id = makeCourseId(name, platform);
    return courses.find(c => c.id === id) || null;
  }, [courses]);

  // Derived stats
  const activeCourses = courses.filter(c => c.status === 'in_progress');
  const completedCourses = courses.filter(c => c.status === 'completed');
  const totalCourses = courses.length;
  const overallProgress = totalCourses > 0
    ? Math.round(courses.reduce((a, c) => a + c.progress, 0) / totalCourses)
    : 0;

  // Unified status
  const getUnifiedStatus = useCallback((hasAssessments) => {
    if (totalCourses === 0) return 'Not Started';
    if (completedCourses.length === totalCourses && hasAssessments) return 'Completed';
    if (completedCourses.length > 0 && !hasAssessments) return 'Assessment Pending';
    if (activeCourses.length > 0) return 'In Progress';
    return 'Not Started';
  }, [totalCourses, completedCourses.length, activeCourses.length]);

  return (
    <CourseProgressContext.Provider value={{
      courses,
      activeCourses,
      completedCourses,
      totalCourses,
      overallProgress,
      startCourse,
      updateProgress,
      completeCourse,
      removeCourse,
      isCourseTracked,
      getUnifiedStatus,
    }}>
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const ctx = useContext(CourseProgressContext);
  if (!ctx) throw new Error('useCourseProgress must be used within CourseProgressProvider');
  return ctx;
}

export default CourseProgressContext;
