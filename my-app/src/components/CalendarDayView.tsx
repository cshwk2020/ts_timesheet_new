import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../reducers';
import { addTask, setTaskTypes } from '../actions/taskActions';
import { fetchTaskTypes } from '../services/taskTypeService';
import { toLocalDateKey } from '../utils/dateUtils';

 

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarDayView: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskTypes = useSelector((state: RootState) => state.tasks.taskTypes);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [taskTypeId, setTaskTypeId] = useState<string>('');
  const [drafts, setDrafts] = useState<Record<number, string>>({}); // hour → text

  // Hydrate task types once (moved here so the component is self-contained)
  useEffect(() => {
    let cancelled = false;
    fetchTaskTypes().then((types) => {
      if (cancelled) return;
      dispatch(setTaskTypes(types));
      if (types.length > 0) setTaskTypeId((prev) => prev || types[0].id);
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const dateKey = toLocalDateKey(selectedDate);

  // Bucket tasks by hour for the selected day
  const tasksByHour = useMemo(() => {
    const map: Record<number, typeof tasks> = {};
    HOURS.forEach((h) => (map[h] = []));
    for (const t of tasks) {
      const d = new Date(t.datetime);
      if (toLocalDateKey(d) !== dateKey) continue;
      map[d.getHours()].push(t);
    }
    return map;
  }, [tasks, dateKey]);

  const goPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const goNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleAdd = (hour: number) => {
    const text = (drafts[hour] ?? '').trim();
    if (!text || !taskTypeId) return;

    // Build an ISO datetime for that day at that hour
    const dt = new Date(selectedDate);
    dt.setHours(hour, 0, 0, 0);

    dispatch(addTask(dt.toISOString(), text, taskTypeId));
    setDrafts((prev) => ({ ...prev, [hour]: '' }));
  };

  const labelFor = (id: string): string =>
    taskTypes.find((t) => t.id === id)?.name ?? id;

  return (
    <div className="day-view">
      {/* Header: date nav + single task-type combobox */}
      <div className="day-view-header">
        <button onClick={goPrevDay} aria-label="Previous day">‹</button>
        <div className="day-view-date">
          {selectedDate.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <button onClick={goNextDay} aria-label="Next day">›</button>

        <select
          value={taskTypeId}
          onChange={(e) => setTaskTypeId(e.target.value)}
          disabled={taskTypes.length === 0}
          className="day-view-type"
        >
          {taskTypes.length === 0 && <option value="">Loading types…</option>}
          {taskTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* 24 hour cells */}
      <div className="day-view-hours">
        {HOURS.map((hour) => {
          const hh = String(hour).padStart(2, '0');
          const cellTasks = tasksByHour[hour] ?? [];

          return (
            <div key={hour} className="hour-cell">
              <div className="hour-label">{hh}:00</div>

              <div className="hour-content">
                {cellTasks.map((t) => (
                  <div key={t.id} className="task-chip">
                    <span className="task-chip-type">{labelFor(t.task_type_id)}</span>
                    <span className="task-chip-details">{t.task_details}</span>
                  </div>
                ))}

                <div className="hour-add">
                  <input
                    type="text"
                    placeholder="Add task…"
                    value={drafts[hour] ?? ''}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [hour]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAdd(hour);
                    }}
                  />
                  <button
                    onClick={() => handleAdd(hour)}
                    disabled={!(drafts[hour] ?? '').trim() || !taskTypeId}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDayView;