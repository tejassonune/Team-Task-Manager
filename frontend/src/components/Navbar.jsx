import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <Link href="/"><a className="font-bold text-xl">Team Task Manager</a></Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login"><a className="mr-4">Login</a></Link>
            <Link href="/register"><a>Register</a></Link>
          </>
        )}
      </div>
    </nav>
  );
}
