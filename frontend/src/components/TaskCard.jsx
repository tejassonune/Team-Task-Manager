export default function TaskCard({ task }) {
  return (
    <div className="bg-white p-3 rounded shadow mb-2 border cursor-pointer">
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500">Assignee: {task.assignee ? task.assignee.name : 'Unassigned'}</p>
      <p className="text-xs text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
    </div>
  );
}
