import './reset.css';
import './App.css';
import TodoForm from './Components/TodoForm';
import TodoList from './Components/TodoList';
import CheckAllandRemaining from './Components/CheckAllandRemaining';
import TodoFilters from './Components/TodoFilters';
import ClearCompletedBtn from './Components/ClearCompletedBtn';
import { useCallback, useEffect, useState } from 'react';

function App() {

  let [todos,setTodos] = useState([]);
  let [filterTodos,setFilteredTodos] = useState(todos);

  useEffect(()=>{
    fetch('http://localhost:3001/todos')
    .then(res=>res.json())
    .then((todos)=>{
      setTodos(todos)
      setFilteredTodos(todos)
    })
  },[])

  let filterBy = useCallback((filter) => {
    if(filter === 'All') {
      setFilteredTodos(todos);
    }
    if(filter === 'Active') {
      setFilteredTodos(todos.filter(t => !t.completed))
    }
    if(filter === 'Completed') {
      setFilteredTodos(todos.filter(t => t.completed))
    }
  },[todos])



  let addTodo = (todo)=>{
    fetch('http://localhost:3001/todos',{
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo)
    })
    setTodos(prevState=>[...prevState,todo])
  }

  let deleteTodo = (ID)=>{
    fetch(`http://localhost:3001/todos/${ID}`,{
      method : "DELETE"
    })
    setTodos(prevState => {
      return prevState.filter(todo => {
        return todo.id !== ID
      });
    })
  }

  let updateTodo = (todo)=>{
    fetch(`http://localhost:3001/todos/${todo.id}`,{
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo)
    })

    setTodos(prevState=>{
      return prevState.map(t=>{
        if(t.id === todo.id){
          return todo
        }
        return t
      })
    })
  }

  let checkAll = ()=>{
    //server side
    todos.forEach(t=>{
      t.completed = true;
      updateTodo(t);
    })
    //client side
    setTodos(prevState =>{
      return prevState.map(t=>{
        return {...t,completed:true}
      })
    })
  }

  let clearCompleted = ()=>{
    todos.forEach(t=>{
      if(t.completed){
        deleteTodo(t.id);
      }
    })
    //client side
    setTodos(prevState=>{
      return prevState.filter(t=>!t.completed)
    })
  }

  let remainingCount =todos.filter(t=>!t.completed).length;


  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>
        <TodoForm addTodo={addTodo}/>

        <TodoList todos={filterTodos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>

        <CheckAllandRemaining remainingCount={remainingCount} checkAll={checkAll}/>

        <div className="other-buttons-container">
          <TodoFilters filterBy={filterBy}/>
          <ClearCompletedBtn clearCompleted={clearCompleted}/>
        </div>
      </div>
    </div>
  );
}

export default App;