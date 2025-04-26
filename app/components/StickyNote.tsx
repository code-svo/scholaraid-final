import React, { useState, useRef } from 'react';

interface StickyNoteProps {
  onClose: () => void;
}

const StickyNote: React.FC<StickyNoteProps> = ({ onClose }) => {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState<boolean[]>([]);
  const noteRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState({ x: 100, y: 100, offsetX: 0, offsetY: 0, dragging: false });

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (noteRef.current) {
      setDrag({
        ...drag,
        dragging: true,
        offsetX: e.clientX - drag.x,
        offsetY: e.clientY - drag.y,
      });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (drag.dragging) {
      setDrag({ ...drag, x: e.clientX - drag.offsetX, y: e.clientY - drag.offsetY, dragging: true });
    }
  };
  const handleMouseUp = () => {
    setDrag({ ...drag, dragging: false });
  };

  // To-do logic
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setChecked([...checked, false]);
      setInput('');
    }
  };
  const toggleCheck = (idx: number) => {
    setChecked(checked.map((c, i) => (i === idx ? !c : c)));
  };
  const removeTodo = (idx: number) => {
    setTodos(todos.filter((_, i) => i !== idx));
    setChecked(checked.filter((_, i) => i !== idx));
  };

  return (
    <div
      ref={noteRef}
      style={{
        position: 'fixed',
        left: drag.x,
        top: drag.y,
        zIndex: 9999,
        width: 260,
        background: '#fffbe7',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        borderRadius: 12,
        padding: 16,
        cursor: drag.dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        color: '#222',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, color: '#b59f3b' }}>To-Do List</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#b59f3b', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
          placeholder="Add a to-do..."
          style={{ width: '75%', padding: 4, borderRadius: 4, border: '1px solid #e6d88b', marginRight: 4, color: '#222' }}
        />
        <button onClick={addTodo} style={{ background: '#ffe066', border: 'none', borderRadius: 4, padding: '4px 8px', color: '#b59f3b', fontWeight: 700, cursor: 'pointer' }}>+</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 180, overflowY: 'auto' }}>
        {todos.map((todo, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <input
              type="checkbox"
              checked={checked[idx]}
              onChange={() => toggleCheck(idx)}
              style={{ marginRight: 8 }}
            />
            <span style={{ textDecoration: checked[idx] ? 'line-through' : 'none', flex: 1, color: '#222' }}>{todo}</span>
            <button onClick={() => removeTodo(idx)} style={{ background: 'none', border: 'none', color: '#b59f3b', fontWeight: 700, marginLeft: 8, cursor: 'pointer' }}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StickyNote; 