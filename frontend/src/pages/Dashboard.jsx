import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({ title: '', description: '', status: 'To Do' });

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => [...prev, res.data]);
      setNewTask({ title: '', description: '', status: 'To Do' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditingTask({ title: task.title, description: task.description, status: task.status });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/tasks/${id}`, editingTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev =>
        prev.map(task => (task._id === id ? res.data : task))
      );
      setEditingTaskId(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => prev.filter(task => task._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const statusColors = {
    'To Do': 'bg-gray-300 text-gray-800',
    'In Progress': 'bg-yellow-300 text-yellow-900',
    'Done': 'bg-green-300 text-green-900',
  };

  if (!user) return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={newTask.title}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Tasks</h2>

        {loading ? (
          <p className="text-gray-600">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-6">
            {tasks.map(task => (
              <li
                key={task._id}
                className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                {editingTaskId === task._id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="description"
                      value={editingTask.description}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      name="status"
                      value={editingTask.status}
                      onChange={handleEditChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => saveEdit(task._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <p className="text-gray-600">{task.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}
                      >
                        {task.status}
                      </span>
                      <button
                        onClick={() => startEditing(task)}
                        className="text-blue-600 hover:underline"
                        aria-label={`Edit task ${task.title}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-600 hover:underline"
                        aria-label={`Delete task ${task.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
