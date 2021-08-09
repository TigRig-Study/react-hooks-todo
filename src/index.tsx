import React, {useState} from 'react';
import ReactDOM from 'react-dom';

interface Todo {
  value: string
  id: number
  checked: boolean
  removed: boolean
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed'

const App = () => {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')

  const filteredTodos = todos.filter((todo) => {
    switch(filter) {
      case 'all':
        return !todo.removed
      case 'checked':
        return todo.checked
      case 'unchecked':
        return !todo.checked
      case 'removed':
        return todo.removed
      default:
        return todo
    }
  })

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
    e.preventDefault()

    // 何も入力されていなかったらリターン
    if(!text) return

    // 新しい Todo を作成
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
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

  const handleOnRemove = (id: number) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id) {
        todo.removed = !todo.removed
      }
      return todo
    })
    setTodos(newTodos)
  }

  return (
    <div>
      <select defaultValue="all" onChange={(e) => {setFilter(e.target.value as Filter)}}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">削除済みのタスク</option>
      </select>
      <form onSubmit={(e) => handleOnSubmit(e)}>
        <input
          disabled={filter === 'checked' || filter === 'removed'}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          disabled={filter === 'checked' || filter === 'removed'}
          type="submit"
          value="追加"
          onSubmit={(e) => handleOnSubmit(e)}
        />
      </form>
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input disabled={todo.removed} type="checkbox" checked={todo.checked} onChange={(e) => handleOnCheck(todo.id, e.target.checked)}/>
              <input disabled={todo.checked || todo.removed} type="text" value={todo.value} onChange={(e) => handleOnEdit(todo.id, e.target.value)} />
              <button onClick={() => handleOnRemove(todo.id)}>{todo.removed ? '復元' : '削除'}</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))