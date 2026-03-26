-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'leaner' -- learner, admin
);

-- Skills Table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- User Skills (Many-to-Many via proficiency)
CREATE TABLE user_skills (
    user_id INT REFERENCES users(id),
    skill_id INT REFERENCES skills(id),
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, skill_id)
);

-- Courses/Learning Paths Table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_skill_id INT REFERENCES skills(id)
);

-- Assessments Table
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id INT REFERENCES courses(id),
    max_score INT NOT NULL
);
