import { useState } from 'react';

export default function AuthForm({ onSubmit, isRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await onSubmit(name, email, password);
      } else {
        await onSubmit(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-8 text-center">{isRegister ? 'Register' : 'Login'}</h2>

      {isRegister && (
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
          />
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
      </div>

      {error && <p className="mb-6 text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        {isRegister ? 'Register' : 'Login'}
      </button>
    </form>
  );
}
