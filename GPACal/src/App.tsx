import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Plus, Menu, X } from "lucide-react";
import { Button } from "./components/ui/button";

const gradeOptions: { [key: string]: number } = {
  "A+ (4.0)": 4.0,
  "A (4.0)": 4.0,
  "A- (3.7)": 3.7,
  "B+ (3.3)": 3.3,
  "B (3.0)": 3.0,
  "B- (2.7)": 2.7,
  "C+ (2.3)": 2.3,
  "C (2.0)": 2.0,
  "C- (1.7)": 1.7,
  "D+ (1.3)": 1.3,
  "D (1.0)": 1.0,
  "E (0.0)": 0.0,
};

function App() {
  const [courses, setCourses] = useState([{ credit: 0, grade: 4.0 }]);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const addCourse = () => {
    setCourses([...courses, { credit: 0, grade: 4.0 }]);
  };

  const updateCourse = (
    index: number,
    field: "credit" | "grade",
    value: number
  ) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const calculateGPA = () => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credit, 0);
    if (totalCredits === 0) return 0;
    const totalPoints = courses.reduce((sum, c) => sum + c.credit * c.grade, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const GPA = calculateGPA();

  return (
    <div className="min-h-screen transition-colors bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Navigation Bar (Desktop) */}
      <nav className="hidden sm:flex bg-blue-600 text-white p-4 justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => setPage("home")}
          >
            GPA Calculator
          </h1>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("calculator")}>GPA Calculator</button>
          <button onClick={() => setPage("guidance")}>Guidance</button>
        </div>
        <Button
          onClick={toggleTheme}
          variant="outline"
          className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          {darkMode ? <Sun /> : <Moon />}
        </Button>
      </nav>

      {/* Navigation Bar (Mobile) */}
      <nav className="sm:hidden flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => setPage("home")}
        >
          GPA Calculator
        </h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-64 h-full bg-blue-600 text-white p-6 z-50 shadow-lg flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {["home", "calculator", "guidance"].map((label, idx) => (
              <motion.button
                key={label}
                onClick={() => {
                  setPage(label);
                  setIsMenuOpen(false);
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                className="text-left"
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto"
            >
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="w-full bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                {darkMode ? (
                  <Sun className="mr-2" />
                ) : (
                  <Moon className="mr-2" />
                )}{" "}
                Toggle Theme
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="p-6">
        {page === "home" && (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
            <h2 className="text-4xl font-bold text-center">
              Welcome to the GPA Calculator
            </h2>
            <p className="text-lg text-center max-w-xl">
              Easily calculate your Grade Point Average by adding your courses,
              credits, and grades.
            </p>
            <Button size="lg" onClick={() => setPage("calculator")}>
              Get Started
            </Button>
          </div>
        )}

        {page === "calculator" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {courses.map((course, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center"
              >
                <input
                  type="number"
                  min={0}
                  placeholder="Credit"
                  className="p-2 border rounded w-full bg-white dark:bg-gray-800 dark:text-black"
                  value={course.credit}
                  onChange={(e) =>
                    updateCourse(index, "credit", Number(e.target.value))
                  }
                />
                <select
                  className="p-2 border rounded w-full bg-white dark:bg-gray-800 dark:text-black"
                  value={course.grade}
                  onChange={(e) =>
                    updateCourse(index, "grade", Number(e.target.value))
                  }
                >
                  {Object.entries(gradeOptions).map(([label, value]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <Button
              onClick={addCourse}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Plus size={16} /> Add Course
            </Button>

            <motion.div
              className="w-40 h-40 rounded-full border-8 border-blue-500 flex items-center justify-center text-2xl font-bold mx-auto"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              GPA: {GPA}
            </motion.div>
          </div>
        )}

        {page === "guidance" && (
          <div className="max-w-3xl mx-auto space-y-4 text-lg">
            <h2 className="text-3xl font-bold mb-4">How GPA is Calculated</h2>
            <p>
              1. Add each course with its respective credit hours and grade.
            </p>
            <p>
              2. Multiply each course's credit hours by its grade point to get
              quality points.
            </p>
            <p>3. Sum all the quality points to get total points.</p>
            <p>4. Sum all the credit hours.</p>
            <p>5. Divide the total points by total credit hours.</p>

            <h3 className="text-2xl font-semibold mt-6">Example:</h3>
            <p>- Course 1: 3 credits, Grade A (3.7) → 3 x 3.7 = 11.1</p>
            <p>- Course 2: 4 credits, Grade B+ (3.3) → 4 x 3.3 = 13.2</p>
            <p>- Total Credits = 7</p>
            <p>- Total Points = 11.1 + 13.2 = 24.3</p>
            <p>- GPA = 24.3 / 7 = 3.47</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
