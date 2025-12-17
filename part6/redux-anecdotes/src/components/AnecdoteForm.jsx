import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleSubmit = async event => {
        event.preventDefault()
        const anecdote = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(appendAnecdote(anecdote))
        dispatch(setNotification(`You created '${anecdote}'`, 5))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <input name="anecdote"/>
                </div>
                <button>create</button>
            </form>
        </>
    )    
}

export default AnecdoteForm