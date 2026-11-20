import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../reducers';
import { formatDateTime } from '../utils/dateUtils';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
    <div>
      <h2>All Tasks ({tasks.length})</h2>
      
      {tasks.length === 0 && <p style={{ color: '#888' }}>No tasks yet. Click a calendar cell to add one.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{task.task_details}</div>
            <div style={{ fontSize: '0.85em', color: '#666' }}>
              {/* Just display the raw ID or the label if you map it later */}
              {task.task_type_id} · {formatDateTime(task.from_datetime)} - {formatDateTime(task.to_datetime)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;