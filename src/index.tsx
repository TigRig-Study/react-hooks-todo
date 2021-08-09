import React, {useReducer} from 'react';
import ReactDOM from 'react-dom';

interface Todo {
  value: string
  id: number
  checked: boolean
  removed: boolean
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed'

interface State {
  text: string
  todos: Todo[]
  filter: Filter
}

type Action = 
  | {type: 'change'; value: string}
  | {type: 'filter'; value: Filter}
  | {type: 'submit'}
  | {type: 'empty'}
  | {type: 'edit'; id: number; value: string}
  | {type: 'check'; id: number; checked: boolean}
  | {type: 'remove'; id: number;}

const inisialState: State = {
  text: '',
  todos: [],
  filter: 'all',
}

const reducer = (state: State, action: Action): State => {
  switch(action.type) {
    case 'change':
      return {...state, text: action.value}
    case 'submit': {
      // 何も入力されていなかったらリターン
      if(!state.text) return state
  
      // 新しい Todo を作成
      const newTodo: Todo = {
        value: state.text,
        id: new Date().getTime(),
        checked: false,
        removed: false,
      }

      return {...state, todos: [newTodo, ...state.todos], text: ''}
    }
    case 'edit': {
      const newTodos = state.todos.map((todo) => {
        if(todo.id === action.id) {
          todo.value = action.value
        }
        return todo
      })
      return {...state, todos: newTodos}
    }
    case 'check': {
      const newTodos = state.todos.map((todo) => {
        if(todo.id === action.id) {
          todo.checked = action.checked
        }
        return todo
      })
      return {...state, todos: newTodos}
    }
    case 'remove': {
      const newTodos = state.todos.map((todo) => {
        if(todo.id === action.id) {
          todo.removed = !todo.removed
        }
        return todo
      })
      return {...state, todos: newTodos}
    }
    case 'empty': {
      const newTodos = state.todos.filter((todo) => !todo.removed)
      return {...state, todos: newTodos}
    }
    case 'filter': {
      return {...state, filter: action.value}
    }
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, inisialState)

  const filteredTodos = state.todos.filter((todo) => {
    switch(state.filter) {
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    dispatch({type: 'change', value: e.target.value})
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
    e.preventDefault()
    dispatch({type: 'submit'})
  }

  const handleOnEdit = (id: number, value: string) => {
    dispatch({type: 'edit', id, value})
  }

  const handleOnCheck = (id: number, checked: boolean) => {
    dispatch({type: 'check', id, checked})
  }

  const handleOnRemove = (id: number) => {
    dispatch({type: 'remove', id})
  }

  const handleOnEmpty = () => {
    dispatch({type: 'empty'})
  }

  const handleOnFilter = (value: Filter) => {
    dispatch({type: 'filter', value})
  }

  return (
    <div>
      <select defaultValue="all" onChange={(e) => {handleOnFilter(e.target.value as Filter)}}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">削除済みのタスク</option>
      </select>
      {
        state.filter === 'removed'
        ? <button
            disabled={state.todos.filter((todo) => todo.removed).length === 0}
            onClick={() => handleOnEmpty()}>ゴミ箱を空にする
          </button>
        : <form onSubmit={(e) => handleOnSubmit(e)}>
          <input
            disabled={state.filter === 'checked'}
            type="text"
            value={state.text}
            onChange={(e) => handleOnChange(e)}
          />
          <input
            disabled={state.filter === 'checked'}
            type="submit"
            value="追加"
            onSubmit={(e) => handleOnSubmit(e)}
          />
        </form>
      }
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