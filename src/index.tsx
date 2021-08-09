import React, {useState} from 'react';
import ReactDOM from 'react-dom';

interface Todo {
  value: string
  id: number
  checked: boolean
}

const App = () => {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
    e.preventDefault()

    // 何も入力されていなかったらリターン
    if(!text) return

    // 新しい Todo を作成
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false
    }

    // イミュータブル な操作を行うため、 todos 自体を更新せず、
    // todos のコピー ＋ newTodo を setTodos する
    setTodos([...todos, newTodo])

    // フォームの入力をクリア
    setText('')
  }

  const handleOnEdit = (id: number, value: string) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id) {
        todo.value = value
      }
      return todo
    })
    setTodos(newTodos)
  }

  const handleOnCheck = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id) {
        todo.checked = checked
      }
      return todo
    })
    setTodos(newTodos)
  }

  return (
    <div>
      <form onSubmit={(e) => handleOnSubmit(e)}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <input type="submit" value="追加" onSubmit={(e) => handleOnSubmit(e)} />
      </form>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input type="checkbox" checked={todo.checked} onChange={(e) => handleOnCheck(todo.id, e.target.checked)}/>
              <input disabled={todo.checked} type="text" value={todo.value} onChange={(e) => handleOnEdit(todo.id, e.target.value)} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))