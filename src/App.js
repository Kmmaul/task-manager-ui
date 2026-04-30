import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  // Load tasks
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Create task
  const addTask = () => {
    if (!newTitle.trim()) return;

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: newTitle })
    })
      .then(res => res.json())
      .then(task => {
        setTasks([...tasks, task]);
        setNewTitle("");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>

      {/* Form */}
      <input
        type="text"
        placeholder="Enter task"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      {/* List */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;