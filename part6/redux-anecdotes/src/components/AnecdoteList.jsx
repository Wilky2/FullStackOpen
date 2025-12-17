import { useSelector, useDispatch } from 'react-redux'
import { voted } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({anecdotes, filter}) => {
        if(filter === ''){
            return anecdotes
        }

        return anecdotes.filter(anecdote=>anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        console.log('vote', anecdote)
        dispatch(voted(anecdote))
        dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
    }


    const sortedAnecdotes = [...anecdotes].sort((anecdote1, anecdote2) => anecdote2.votes-anecdote1.votes)

    return (
        <>
            {sortedAnecdotes.map(anecdote => (
                <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote)}>vote</button>
                </div>
                </div>
            ))}
        </>
    )
}

export default AnecdoteList