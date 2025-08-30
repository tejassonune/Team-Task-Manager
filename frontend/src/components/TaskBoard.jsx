import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const columnsOrder = ['To Do', 'In Progress', 'Done'];

export default function TaskBoard({ tasks, onStatusChange }) {
  // Group tasks by status
  const columns = columnsOrder.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto">
        {columnsOrder.map(status => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 rounded p-3 w-72 flex-shrink-0"
              >
                <h3 className="font-bold mb-2">{status}</h3>
                {columns[status].map((task, index) => (
                  <Draggable draggableId={task._id} index={index} key={task._id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
