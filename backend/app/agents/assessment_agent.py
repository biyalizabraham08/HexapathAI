import json
import logging
import random
from ..utils.ai_provider import ai_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────
# Offline question bank – used when the API is unavailable
# ─────────────────────────────────────────────────────────
QUESTION_BANK = {
    "python": [
        {"skill": "Python", "question": "What is the output of `type([])`?", "options": ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], "correct_answer": 0},
        {"skill": "Python", "question": "Which keyword is used to define a generator function?", "options": ["return", "yield", "generate", "async"], "correct_answer": 1},
        {"skill": "Python", "question": "What does `*args` allow in a function?", "options": ["Keyword arguments", "Variable positional arguments", "Default arguments", "Global variables"], "correct_answer": 1},
        {"skill": "Python", "question": "Which of the following is immutable in Python?", "options": ["List", "Dictionary", "Tuple", "Set"], "correct_answer": 2},
        {"skill": "Python", "question": "What is the result of `3 ** 2` in Python?", "options": ["6", "9", "32", "5"], "correct_answer": 1},
        {"skill": "Python", "question": "Which module is used for regular expressions in Python?", "options": ["regex", "re", "regexp", "pattern"], "correct_answer": 1},
        {"skill": "Python", "question": "What does `len({'a': 1, 'b': 2})` return?", "options": ["1", "2", "3", "4"], "correct_answer": 1},
        {"skill": "Python", "question": "How do you open a file for reading in Python?", "options": ["open('f', 'w')", "open('f', 'r')", "open('f', 'x')", "open('f', 'a')"], "correct_answer": 1},
        {"skill": "Python", "question": "What is a list comprehension?", "options": ["A loop syntax", "A compact way to create lists", "A built-in function", "A data type"], "correct_answer": 1},
        {"skill": "Python", "question": "Which of the following is a valid Python decorator?", "options": ["@decorator", "#decorator", "%decorator", "&decorator"], "correct_answer": 0},
        {"skill": "Python", "question": "What is the purpose of `__init__` in a class?", "options": ["Destructor", "Constructor", "Class method", "Static method"], "correct_answer": 1},
        {"skill": "Python", "question": "What does `zip([1,2], ['a','b'])` produce?", "options": ["[(1,'a'),(2,'b')]", "[[1,'a'],[2,'b']]", "(1,'a',2,'b')", "{1:'a',2:'b'}"], "correct_answer": 0},
        {"skill": "Python", "question": "How do you handle exceptions in Python?", "options": ["try/catch", "try/except", "if/else", "begin/rescue"], "correct_answer": 1},
        {"skill": "Python", "question": "What is a lambda function?", "options": ["A class", "An anonymous function", "A module", "A loop"], "correct_answer": 1},
        {"skill": "Python", "question": "Which data structure uses LIFO order?", "options": ["Queue", "Stack", "Heap", "Graph"], "correct_answer": 1},
        {"skill": "Python", "question": "What does `dict.get('key', 'default')` do?", "options": ["Raises KeyError if missing", "Returns None if missing", "Returns 'default' if missing", "Sets the key"], "correct_answer": 2},
        {"skill": "Python", "question": "What is the output of `bool(0)`?", "options": ["True", "False", "0", "None"], "correct_answer": 1},
        {"skill": "Python", "question": "Which method removes the last element from a list?", "options": ["remove()", "delete()", "pop()", "discard()"], "correct_answer": 2},
        {"skill": "Python", "question": "What is PEP 8?", "options": ["A Python version", "A package manager", "Python style guide", "A testing framework"], "correct_answer": 2},
        {"skill": "Python", "question": "How do you check if a key exists in a dictionary?", "options": ["key in dict", "dict.has(key)", "dict.contains(key)", "key.exists(dict)"], "correct_answer": 0},
    ],
    "javascript": [
        {"skill": "JavaScript", "question": "What does `typeof null` return?", "options": ["'null'", "'object'", "'undefined'", "'boolean'"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "Which keyword declares a block-scoped variable?", "options": ["var", "let", "function", "const"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "What is a Promise in JavaScript?", "options": ["A loop", "An async operation placeholder", "A class", "A DOM event"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "What does `===` check in JavaScript?", "options": ["Value only", "Type only", "Value and type", "Reference"], "correct_answer": 2},
        {"skill": "JavaScript", "question": "What is the DOM?", "options": ["A database method", "Document Object Model", "Data Output Module", "Dynamic Object Management"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "Which array method creates a new transformed array?", "options": ["forEach", "filter", "map", "reduce"], "correct_answer": 2},
        {"skill": "JavaScript", "question": "What does `async/await` simplify?", "options": ["Loops", "Class inheritance", "Promise handling", "DOM manipulation"], "correct_answer": 2},
        {"skill": "JavaScript", "question": "What is `NaN`?", "options": ["A string type", "Not-a-Number", "Null value", "Negative integer"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "How do you select an element by ID in the DOM?", "options": ["document.querySelector('.id')", "document.getElementByClass('id')", "document.getElementById('id')", "document.select('#id')"], "correct_answer": 2},
        {"skill": "JavaScript", "question": "What is an arrow function?", "options": ["A function pointer", "A shorter function syntax", "A class method", "A recursive function"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "What does JSON.stringify() do?", "options": ["Parses JSON", "Converts JS object to JSON string", "Validates JSON", "Fetches JSON"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "Which event fires when a page finishes loading?", "options": ["onload", "onclick", "onready", "onstart"], "correct_answer": 0},
        {"skill": "JavaScript", "question": "What is closure in JavaScript?", "options": ["A loop", "A function with access to its outer scope", "A class", "A module pattern"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "What does `Array.from('hello')` produce?", "options": ["['hello']", "['h','e','l','l','o']", "{0:'h'}", "Error"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "How do you add an event listener?", "options": ["element.on('click', fn)", "element.addEventListener('click', fn)", "element.listen('click', fn)", "element.click = fn"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "What is hoisting in JavaScript?", "options": ["Lifting DOM elements", "Moving declarations to the top", "Async loading", "Error handling"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "What does `spread operator (...)` do?", "options": ["Loops arrays", "Expands an iterable", "Creates closures", "Joins strings"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "Which method returns the index of a found element?", "options": ["findIndex()", "search()", "locate()", "position()"], "correct_answer": 0},
        {"skill": "JavaScript", "question": "What is the event loop in JavaScript?", "options": ["A for loop", "A mechanism for async operations", "A DOM cycle", "A memory manager"], "correct_answer": 1},
        {"skill": "JavaScript", "question": "How do you deep clone an object?", "options": ["Object.copy()", "Object.assign()", "JSON.parse(JSON.stringify())", "Object.clone()"], "correct_answer": 2},
    ],
    "react": [
        {"skill": "React", "question": "What is JSX?", "options": ["A database", "JavaScript XML syntax", "A CSS framework", "A testing tool"], "correct_answer": 1},
        {"skill": "React", "question": "Which hook manages local component state?", "options": ["useEffect", "useContext", "useState", "useRef"], "correct_answer": 2},
        {"skill": "React", "question": "What is the virtual DOM?", "options": ["An HTML file", "A lightweight copy of the real DOM", "A CSS engine", "A server-side renderer"], "correct_answer": 1},
        {"skill": "React", "question": "What does `useEffect` do?", "options": ["Manages state", "Handles side effects", "Creates context", "Memoizes values"], "correct_answer": 1},
        {"skill": "React", "question": "How do you pass data to child components?", "options": ["Via state", "Via props", "Via context only", "Via refs"], "correct_answer": 1},
        {"skill": "React", "question": "What is a controlled component?", "options": ["A component with lifecycle methods", "A component whose value is controlled by React state", "A class component", "A pure component"], "correct_answer": 1},
        {"skill": "React", "question": "What does `key` prop help React with?", "options": ["Styling", "Identifying list items", "Event binding", "Context"], "correct_answer": 1},
        {"skill": "React", "question": "What is React Context used for?", "options": ["Routing", "Global state sharing", "Server calls", "DOM manipulation"], "correct_answer": 1},
        {"skill": "React", "question": "What is the purpose of `useCallback`?", "options": ["Fetching data", "Memoizing functions", "Managing refs", "Creating context"], "correct_answer": 1},
        {"skill": "React", "question": "Which lifecycle method is equivalent to `useEffect(() => {}, [])`?", "options": ["componentWillUnmount", "componentDidUpdate", "componentDidMount", "shouldComponentUpdate"], "correct_answer": 2},
        {"skill": "React", "question": "What is a Fragment in React?", "options": ["A mini component", "A wrapper that adds no DOM nodes", "A lazy component", "A portal"], "correct_answer": 1},
        {"skill": "React", "question": "How do you conditionally render in React?", "options": ["Using loops", "Using ternary or && expression", "Using CSS", "Using refs"], "correct_answer": 1},
        {"skill": "React", "question": "What do React Portals allow?", "options": ["Server-side rendering", "Rendering outside the parent DOM", "State management", "Routing"], "correct_answer": 1},
        {"skill": "React", "question": "What is the default behavior when setState is called?", "options": ["Synchronous re-render", "Asynchronous re-render", "No re-render", "DOM update only"], "correct_answer": 1},
        {"skill": "React", "question": "What is `useMemo` used for?", "options": ["Caching API calls", "Memoizing expensive computations", "Creating refs", "Managing effects"], "correct_answer": 1},
        {"skill": "React", "question": "What is prop drilling?", "options": ["Props through many layers", "Destructuring props", "Using context", "Serializing props"], "correct_answer": 0},
        {"skill": "React", "question": "What does React.lazy() do?", "options": ["Delays setState", "Enables code splitting", "Lazily loads styles", "Skips re-renders"], "correct_answer": 1},
        {"skill": "React", "question": "How do you handle forms in React?", "options": ["With jQuery", "With useState and onChange handlers", "With DOM refs only", "Server-side only"], "correct_answer": 1},
        {"skill": "React", "question": "What is an Error Boundary?", "options": ["A validation rule", "A component that catches JS errors in children", "A network error handler", "A CSS boundary"], "correct_answer": 1},
        {"skill": "React", "question": "What does `React.memo` do?", "options": ["Adds memos to state", "Prevents re-renders when props unchanged", "Creates context", "Manages side effects"], "correct_answer": 1},
    ],
    "machine learning": [
        {"skill": "Machine Learning", "question": "What is supervised learning?", "options": ["Learning without labels", "Learning with labeled data", "Reinforcement learning", "Clustering"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is overfitting?", "options": ["Model too simple", "Model too complex, memorizes training data", "Model with missing data", "High bias model"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "Which algorithm is used for classification?", "options": ["Linear Regression", "K-Means", "Decision Tree", "PCA"], "correct_answer": 2},
        {"skill": "Machine Learning", "question": "What is a confusion matrix?", "options": ["A dataset", "A table showing model prediction results", "A loss function", "A hyperparameter"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is gradient descent?", "options": ["A sorting algorithm", "An optimization method to minimize loss", "A feature selector", "A regularization technique"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is regularization?", "options": ["Data normalization", "Technique to reduce overfitting", "A layer in neural networks", "A metric"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is the purpose of a train/test split?", "options": ["Speed up training", "Evaluate generalization", "Reduce data size", "Balance classes"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What does AUC-ROC measure?", "options": ["Training speed", "Model discrimination performance", "Feature importance", "Loss"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is an epoch in deep learning?", "options": ["A single batch", "One full pass through training data", "A layer", "A learning rate step"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is the purpose of dropout?", "options": ["Remove features", "Reduce overfitting in neural networks", "Speed up training", "Balance data"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is K-Means clustering?", "options": ["Supervised classification", "Unsupervised grouping into K clusters", "Regression", "Dimensionality reduction"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is transfer learning?", "options": ["Moving models between servers", "Reusing a pre-trained model for a new task", "Transferring data", "Online learning"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is precision in classification?", "options": ["TP/(TP+FN)", "TP/(TP+FP)", "TN/(TN+FP)", "Accuracy metric"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is a hyperparameter?", "options": ["A parameter learned from data", "A parameter set before training", "A model weight", "A feature"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is random forest?", "options": ["A single decision tree", "An ensemble of decision trees", "A neural network", "A clustering algorithm"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is feature engineering?", "options": ["Choosing models", "Creating/transforming features for better performance", "Collecting data", "Evaluating models"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is the bias-variance tradeoff?", "options": ["Speed vs memory", "Underfitting vs overfitting balance", "Precision vs recall", "Model vs data size"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is one-hot encoding?", "options": ["Normalizing numbers", "Converting categories to binary vectors", "Scaling features", "Reducing dimensions"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is cross-validation?", "options": ["Testing on training data", "Evaluating using multiple data splits", "Comparing two models", "Testing on unseen data once"], "correct_answer": 1},
        {"skill": "Machine Learning", "question": "What is an activation function?", "options": ["A training optimizer", "A function adding non-linearity to neural networks", "A loss function", "A regularizer"], "correct_answer": 1},
    ],
    "data science": [
        {"skill": "Data Science", "question": "What is exploratory data analysis (EDA)?", "options": ["Building models", "Understanding data through visualization and statistics", "Cleaning data only", "Feature selection"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What does a box plot show?", "options": ["Trend over time", "Distribution and outliers of data", "Correlation", "Bar comparisons"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is the median?", "options": ["Sum divided by count", "Middle value in sorted data", "Most frequent value", "Largest value"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What library is used for data manipulation in Python?", "options": ["NumPy", "Matplotlib", "Pandas", "Scikit-learn"], "correct_answer": 2},
        {"skill": "Data Science", "question": "What is a null value?", "options": ["Zero", "Missing or unknown data", "Negative value", "Empty string"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is correlation?", "options": ["Causation", "A linear relationship between two variables", "Data distribution", "Variance"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is the purpose of normalization?", "options": ["Remove duplicates", "Scale features to a common range", "Fill missing values", "Encode categories"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What does a heatmap visualize?", "options": ["Time series", "Correlation matrix", "Distributions", "Scatter relationships"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is data wrangling?", "options": ["Collecting data", "Cleaning and transforming raw data", "Building pipelines", "Model evaluation"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is standard deviation?", "options": ["Mean of data", "Measure of data spread", "Minimum value", "Outlier count"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is a histogram?", "options": ["A bar chart of categories", "A chart showing data frequency distribution", "A time series plot", "A scatter plot"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is SQL used for in data science?", "options": ["Machine learning", "Querying and managing databases", "Data visualization", "Model deployment"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is an outlier?", "options": ["A very common value", "A data point far from others", "A null value", "A normalized value"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is a pivot table?", "options": ["A database table", "A summarized data table with aggregations", "A visualization", "A join operation"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What does df.describe() do in Pandas?", "options": ["Shows schema", "Returns statistical summary of numeric columns", "Displays first 5 rows", "Shows missing values"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is a data pipeline?", "options": ["A plot", "A sequence of data processing steps", "A database", "A model"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is feature selection?", "options": ["Scaling features", "Choosing relevant features for model training", "Creating new features", "Encoding features"], "correct_answer": 1},
        {"skill": "Data Science", "question": "Which chart is best for showing proportions?", "options": ["Line chart", "Pie chart", "Scatter plot", "Histogram"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is A/B testing?", "options": ["Unit testing", "Comparing two variants to find the better one", "Model validation", "Data splitting"], "correct_answer": 1},
        {"skill": "Data Science", "question": "What is the IQR (Interquartile Range)?", "options": ["Max minus min", "Q3 minus Q1 (middle 50% of data)", "Mean minus median", "Variance measure"], "correct_answer": 1},
    ],
    "sql": [
        {"skill": "SQL", "question": "What does SELECT * FROM table do?", "options": ["Deletes all rows", "Retrieves all columns from a table", "Updates all records", "Creates a table"], "correct_answer": 1},
        {"skill": "SQL", "question": "Which clause filters rows in SQL?", "options": ["GROUP BY", "ORDER BY", "WHERE", "HAVING"], "correct_answer": 2},
        {"skill": "SQL", "question": "What is a primary key?", "options": ["A foreign reference", "A unique identifier for each row", "An index", "A constraint"], "correct_answer": 1},
        {"skill": "SQL", "question": "What does JOIN do?", "options": ["Deletes tables", "Combines rows from multiple tables", "Aggregates data", "Filters rows"], "correct_answer": 1},
        {"skill": "SQL", "question": "What is the difference between INNER JOIN and LEFT JOIN?", "options": ["No difference", "INNER returns matching rows only; LEFT returns all left rows", "LEFT is faster", "INNER is for strings"], "correct_answer": 1},
        {"skill": "SQL", "question": "Which function counts rows?", "options": ["SUM()", "AVG()", "COUNT()", "MAX()"], "correct_answer": 2},
        {"skill": "SQL", "question": "What does GROUP BY do?", "options": ["Filters data", "Groups rows with the same value for aggregation", "Sorts data", "Removes duplicates"], "correct_answer": 1},
        {"skill": "SQL", "question": "What is a foreign key?", "options": ["A key from abroad", "A key referencing another table's primary key", "A composite key", "An index"], "correct_answer": 1},
        {"skill": "SQL", "question": "What does DISTINCT do in SQL?", "options": ["Counts rows", "Returns only unique values", "Orders results", "Filters nulls"], "correct_answer": 1},
        {"skill": "SQL", "question": "What is an index in SQL?", "options": ["A row number", "A structure that speeds up queries", "A constraint", "A join type"], "correct_answer": 1},
        {"skill": "SQL", "question": "What does HAVING differ from WHERE?", "options": ["HAVING is for strings", "HAVING filters aggregated results", "WHERE is faster", "No difference"], "correct_answer": 1},
        {"skill": "SQL", "question": "What is a subquery?", "options": ["A table alias", "A query nested inside another query", "A stored procedure", "A view"], "correct_answer": 1},
        {"skill": "SQL", "question": "What does NULL mean in SQL?", "options": ["Zero value", "Empty string", "Absence of a value", "False"], "correct_answer": 2},
        {"skill": "SQL", "question": "What is a VIEW in SQL?", "options": ["A stored table", "A virtual table based on a query", "A materialized result", "An index type"], "correct_answer": 1},
        {"skill": "SQL", "question": "What is normalization in databases?", "options": ["Scaling numbers", "Organizing data to reduce redundancy", "Creating indexes", "Merging tables"], "correct_answer": 1},
        {"skill": "SQL", "question": "Which statement removes all rows from a table?", "options": ["DELETE", "DROP", "TRUNCATE", "REMOVE"], "correct_answer": 2},
        {"skill": "SQL", "question": "What is a stored procedure?", "options": ["A saved query result", "A reusable block of SQL code", "A trigger", "An index"], "correct_answer": 1},
        {"skill": "SQL", "question": "What does ORDER BY ASC mean?", "options": ["Descending order", "Ascending order", "Random order", "Alphabetical only"], "correct_answer": 1},
        {"skill": "SQL", "question": "What is ACID in databases?", "options": ["A query language", "Atomicity, Consistency, Isolation, Durability", "A join type", "A storage format"], "correct_answer": 1},
        {"skill": "SQL", "question": "What does the UNION operator do?", "options": ["Joins tables", "Combines result sets of two queries", "Filters duplicates", "Merges columns"], "correct_answer": 1},
    ],
    "default": [
        {"skill": "General", "question": "What is an API?", "options": ["A programming language", "Application Programming Interface", "A database system", "A web server"], "correct_answer": 1},
        {"skill": "General", "question": "What does HTTP stand for?", "options": ["HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyper Tool Transfer", "Host Transfer Protocol"], "correct_answer": 0},
        {"skill": "General", "question": "What is version control?", "options": ["Software licensing", "Tracking and managing code changes", "Deploying apps", "Code compilation"], "correct_answer": 1},
        {"skill": "General", "question": "What is Git used for?", "options": ["Project management", "Version control", "Testing", "Deployment"], "correct_answer": 1},
        {"skill": "General", "question": "What does CI/CD stand for?", "options": ["Code Integration/Code Deployment", "Continuous Integration/Continuous Deployment", "Code Inspection/Code Documentation", "Compile/Debug"], "correct_answer": 1},
        {"skill": "General", "question": "What is a REST API?", "options": ["A database", "An architectural style for web services", "A scripting language", "A testing framework"], "correct_answer": 1},
        {"skill": "General", "question": "What is cloud computing?", "options": ["Weather simulation", "On-demand delivery of computing resources over the internet", "A local server", "A type of RAM"], "correct_answer": 1},
        {"skill": "General", "question": "What is Docker?", "options": ["A version control tool", "A containerization platform", "A cloud provider", "A testing tool"], "correct_answer": 1},
        {"skill": "General", "question": "What is agile methodology?", "options": ["A programming language", "An iterative software development approach", "A deployment pipeline", "A testing strategy"], "correct_answer": 1},
        {"skill": "General", "question": "What is a microservice?", "options": ["A tiny script", "A small, independently deployable service", "A database table", "A UI component"], "correct_answer": 1},
        {"skill": "General", "question": "What is JSON?", "options": ["JavaScript Object Notation", "Java Stylesheet Object Notation", "JavaScript Open Network", "JavaOS Notation"], "correct_answer": 0},
        {"skill": "General", "question": "What does HTTPS add to HTTP?", "options": ["Speed", "Encryption/security (TLS)", "Compression", "Caching"], "correct_answer": 1},
        {"skill": "General", "question": "What is a relational database?", "options": ["A flat file", "A database organized in tables with relationships", "A key-value store", "A document store"], "correct_answer": 1},
        {"skill": "General", "question": "What is recursion?", "options": ["A loop type", "A function calling itself", "A data structure", "An algorithm"], "correct_answer": 1},
        {"skill": "General", "question": "What is Big O notation?", "options": ["A programming style", "A way to describe algorithm efficiency", "A design pattern", "A testing method"], "correct_answer": 1},
        {"skill": "General", "question": "What is an IDE?", "options": ["Internet Development Engine", "Integrated Development Environment", "Interactive Debug Engine", "Integrated Docker Engine"], "correct_answer": 1},
        {"skill": "General", "question": "What is a design pattern?", "options": ["A UI template", "A reusable solution to a common problem", "A testing strategy", "A code style"], "correct_answer": 1},
        {"skill": "General", "question": "What is the purpose of unit testing?", "options": ["Test the whole app", "Test a single function or component in isolation", "Test the database", "Load testing"], "correct_answer": 1},
        {"skill": "General", "question": "What is open source software?", "options": ["Free software only", "Software with publicly available source code", "Cloud-based software", "Freeware"], "correct_answer": 1},
        {"skill": "General", "question": "What is a binary search?", "options": ["Searching a database", "Searching a sorted array by halving the search space", "Searching with regex", "A brute-force search"], "correct_answer": 1},
    ]
}


def _get_offline_questions(skills: list, num_total: int) -> list:
    """
    Selects diverse, shuffled questions from the offline bank
    based on the user's skills.
    """
    selected = []
    
    # Try to get skill-specific questions first
    for skill in skills:
        skill_lower = skill.lower()
        bank_key = None
        for key in QUESTION_BANK:
            if key in skill_lower or skill_lower in key:
                bank_key = key
                break
        
        pool = QUESTION_BANK.get(bank_key, QUESTION_BANK["default"])
        shuffled = random.sample(pool, min(len(pool), num_total // max(len(skills), 1) + 2))
        selected.extend(shuffled)
    
    # Shuffle and trim to exact count
    random.shuffle(selected)
    
    if len(selected) < num_total:
        # Fill remaining from default bank
        extra = random.sample(QUESTION_BANK["default"], min(len(QUESTION_BANK["default"]), num_total - len(selected)))
        selected.extend(extra)
    
    return selected[:num_total]


class AssessmentAgent:
    def get_questions(self, skills: list, num_total: int = 20, difficulty: str = "Mixed") -> list:
        """
        Generates questions via OpenRouter (Mistral 7B).
        Falls back to an offline question bank if the API is unavailable.
        """
        questions = self._try_api(skills, num_total, difficulty)
        if questions:
            return questions
        logger.warning("⚠️ OpenRouter unavailable. Using offline question bank.")
        return _get_offline_questions(skills, num_total)

    def _try_api(self, skills: list, num_total: int, difficulty: str = "Mixed"):
        """Attempts OpenRouter Mistral 7B and returns questions or None."""
        prompt = f"""Generate EXACTLY {num_total} technical multiple-choice questions for these skills: {', '.join(skills)}.
        Difficulty: '{difficulty}' level professional.
        Return ONLY a JSON array, no markdown, no extra text. Match this schema exactly:
        [{{"skill": "Skill Name", "question": "Question text", "options": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "Why correct", "difficulty": "{difficulty}", "reference_query": "search query"}}]
        correct_answer MUST be an integer 0-3. Return EXACTLY {num_total} items."""
        
        system = "You are a strict technical interviewer. Output only valid JSON arrays."
        print(f"🚀 [OPENROUTER] Generating {num_total} quiz questions for {skills}...")
        
        raw = ai_client.generate(prompt, system_instruction=system)
        
        try:
            clean = raw.strip()
            if '```json' in clean:
                clean = clean.split('```json')[1].split('```')[0].strip()
            elif '```' in clean:
                clean = clean.split('```')[1].split('```')[0].strip()
            
            questions = json.loads(clean)
            if isinstance(questions, list) and len(questions) > 0:
                logger.info(f"✅ Generated {len(questions)} questions via OpenRouter")
                for q in questions:
                    if isinstance(q.get('correct_answer'), str) and q['correct_answer'].isdigit():
                        q['correct_answer'] = int(q['correct_answer'])
                    elif isinstance(q.get('correct_answer'), str) and q['correct_answer'] in q.get('options', []):
                        q['correct_answer'] = q['options'].index(q['correct_answer'])
                return questions
        except Exception as e:
            logger.warning(f"⚠️ OpenRouter question parsing failed: {str(e)[:80]}")
        return None

    def _get_fallback_questions(self, skills: list, num_total: int) -> list:
        return _get_offline_questions(skills, num_total)

    def evaluate_answers(self, questions: list, user_answers: list) -> dict:
        if not questions or not user_answers:
            return {"score": 0, "passed": False, "total_questions": 0, "correct_count": 0, "per_skill": {}}

        total_correct = 0
        per_skill = {}
        for i, q in enumerate(questions):
            skill = q.get("skill", "General")
            if skill not in per_skill:
                per_skill[skill] = {"correct": 0, "total": 0}
            per_skill[skill]["total"] += 1

            try:
                correct = int(q.get("correct_answer", 0))
            except (ValueError, TypeError):
                correct = 0
            user_ans = int(user_answers[i]) if i < len(user_answers) else -1
            if user_ans == correct:
                total_correct += 1
                per_skill[skill]["correct"] += 1

        for s in per_skill:
            d = per_skill[s]
            d["score"] = round((d["correct"] / d["total"]) * 100) if d["total"] > 0 else 0

        score = round((total_correct / len(questions)) * 100) if questions else 0
        return {
            "score": score,
            "passed": score >= 60,
            "total_questions": len(questions),
            "correct_count": total_correct,
            "per_skill": per_skill
        }


assessment_agent = AssessmentAgent()
