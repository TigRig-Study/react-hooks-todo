import React, {useState} from 'react';
import ReactDOM from 'react-dom';

interface Todo {
  value: string
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
      value: text
    }

    // イミュータブル な操作を行うため、 todos 自体を更新せず、
    // todos のコピー ＋ newTodo を setTodos する
    setTodos([...todos, newTodo])

    // フォームの入力をクリア
    setText('')
  }

  return (
    <div>
      <form onSubmit={(e) => handleOnSubmit(e)}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <input type="submit" value="追加" onSubmit={(e) => handleOnSubmit(e)} />
      </form>
      <ul>
        {todos.map((todo) => {
          return <li>{todo.value}</li>
        })}
      </ul>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))