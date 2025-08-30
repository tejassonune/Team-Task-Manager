import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  const createProject = async e => {
    e.preventDefault();
    setError('');
    try {
      const memberIds = members.split(',').map(m => m.trim()).filter(m => m.length > 0);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        name,
        description,
        members: memberIds,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setDescription('');
      setMembers('');
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Your Projects</h2>
        {error && <p className="text-red-600">{error}</p>}
        <ul className="mb-6">
          {projects.map(project => (
            <li key={project._id} className="border p-3 rounded mb-2 hover:bg-gray-100">
              <Link href={`/projects/${project._id}`}>
                <a className="text-blue-600 font-semibold">{project.name}</a>
              </Link>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-xs text-gray-500">Owner: {project.owner.name}</p>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
        <form onSubmit={createProject} className="space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Member IDs (comma separated)"
            value={members}
            onChange={e => setMembers(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Project
          </button>
        </form>
      </div>
    </>
  );
}
