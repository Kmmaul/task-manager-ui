import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load tasks
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Create task
  const addTask = () => {
    if (!newTitle.trim()) {
      alert("Task title required");
      return;}

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
//delete task
const deleteTask = (id) => {
  fetch(`http://localhost:3000/tasks/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      setTasks(tasks.filter(task => task.id !== id));
    });
};

//toggle task
const toggleTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}/toggle`, {
    method: "PATCH"
  })
    .then(res => res.json())
    .then(updatedTask => {
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    });
};

//edit task
const startEditing = (task) => {
  setEditingId(task.id);
  setEditingTitle(task.title);
};

const cancelEditing = () => {
  setEditingId(null);
  setEditingTitle("");
};


const saveEdit = (id) => {
  if (!editingTitle.trim()) {
    alert("Task title required");
    return;
  }

  fetch(`http://localhost:3000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: editingTitle })
  })
    .then(res => res.json())
    .then(updatedTask => {
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));

      setEditingId(null);
      setEditingTitle("");
    });
};

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task Manager</h1>

      {/* Form */}
      <input
        type="text"
        placeholder="Enter task"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{marginRight: "10px"}}
      />
      <button onClick={addTask}>Add Task</button>

      {/* List */}
      <ul>
        {tasks.map(task => (
        <li key={task.id} style={{ marginTop: "10px" }}>
          {editingId === task.id ? (
            <>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
              />

              <button onClick={() => saveEdit(task.id)} style={{ marginLeft: "10px" }}>
                Save
              </button>

              <button onClick={cancelEditing} style={{ marginLeft: "5px" }}>
                Cancel
              </button>
            </>
          ) : (
            <>
              {task.title} - {task.completed ? "✅" : "❌"}

              <button onClick={() => toggleTask(task.id)} style={{ marginLeft: "10px" }}>
                Toggle
              </button>

              <button onClick={() => startEditing(task)} style={{ marginLeft: "5px" }}>
                Edit
              </button>

              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "5px" }}>
                Delete
              </button>
            </>
          )}
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;