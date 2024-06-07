import React, { useState } from 'react'

export default function TodoForm({addTodo}) {

  let [title,setTitle] = useState('');


  let handleSubmit = (e) => {
    e.preventDefault();
    let todoData = {
      id : Math.random(),
      title,
      completed : false
    }
    addTodo(todoData);
    setTitle('');
  }

  return (
    <form action="#" onSubmit={handleSubmit}>
        <input
            type="text"
            className="todo-input"
            placeholder="What do you need to do?"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
        />
    </form>
  )
}
