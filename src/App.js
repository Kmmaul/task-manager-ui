import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load tasks
useEffect(() => {
  fetch(`${API}/tasks`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }
      return res.json();
    })
    .then(data => {
      setTasks(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);

  // Create task
  const addTask = () => {
    if (!newTitle.trim()) {
      alert("Task title required");
      return;}

    fetch(`${API}/tasks`, {
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
    if(!window.confirm("Delete this task?"))
    {
      return;
    }
  fetch(`${API}/tasks/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      setTasks(tasks.filter(task => task.id !== id));
    });
};

//toggle task
const toggleTask = (id) => {
    fetch(`${API}/tasks/${id}/toggle`, {
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

  fetch(`${API}/tasks/${id}`, {
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
        {loading && <p>Loading tasks...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Form */}
      <input
        type="text"
        placeholder="Enter task"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTask();
          }
        }}
        style={{ marginRight: "10px" }}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEdit(task.id);
                    }

                    if (e.key === "Escape") {
                      cancelEditing();
                    }
                  }}
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