// src/components/TaskList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../reducers';
import { addTask, setTaskTypes } from '../actions/taskActions';
import { fetchTaskTypes } from '../services/taskTypeService';
import {
  formatDateTime,
  getCurrentDatetimeLocal,
} from '../utils/dateUtils';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskTypes = useSelector((state: RootState) => state.tasks.taskTypes);
  const dispatch = useDispatch();

  const [taskDetails, setTaskDetails] = useState('');
  const [datetime, setDatetime] = useState(getCurrentDatetimeLocal());
  const [taskTypeId, setTaskTypeId] = useState<string>('');

  //
  useEffect(() => {
    let cancelled = false;
    fetchTaskTypes().then((types) => {
      if (cancelled) return;
      dispatch(setTaskTypes(types));
      if (types.length > 0) setTaskTypeId(types[0].id);
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const handleAddTask = () => {
    if (taskDetails.trim() === '' || !taskTypeId) return;

    const finalDatetime = datetime || new Date().toISOString();
    dispatch(addTask(finalDatetime, taskDetails.trim(), taskTypeId));

    setTaskDetails('');
    setDatetime(getCurrentDatetimeLocal());
  };

  const labelFor = (id: string): string =>
    taskTypes.find((t) => t.id === id)?.name ?? id;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter task details..."
          value={taskDetails}
          onChange={(e) => setTaskDetails(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          style={{ padding: '8px' }}
        />
        <select
          value={taskTypeId}
          onChange={(e) => setTaskTypeId(e.target.value)}
          style={{ padding: '8px' }}
          disabled={taskTypes.length === 0}
        >
          {taskTypes.length === 0 && <option value="">Loading types…</option>}
          {taskTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          style={{ padding: '10px', cursor: 'pointer' }}
          disabled={taskTypes.length === 0}
        >
          Add Task
        </button>
      </div>

      <h2>All Tasks ({tasks.length})</h2>
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
              {labelFor(task.task_type_id)} · {formatDateTime(task.datetime)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;