INSERT INTO users (username, email, password_hash, role) VALUES 
('admin1', 'admin@skillgap.ai', 'hashedpassword1', 'admin'),
('john_doe', 'john@example.com', 'hashedpassword2', 'learner');

INSERT INTO skills (name, description) VALUES 
('Python', 'General purpose programming language'),
('React', 'Frontend JavaScript library'),
('SQL', 'Database query language');

INSERT INTO courses (title, description, target_skill_id) VALUES 
('Python for Beginners', 'Learn basic Python', 1),
('Advanced React Patterns', 'Master React components', 2);

INSERT INTO assessments (title, course_id, max_score) VALUES 
('Python Basics Quiz', 1, 100),
('React Component Test', 2, 100);
