import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'
import anecdoteService from './services/anecdotes'

const App = () => {

  const queryClient = useQueryClient()

  const { notificationDispatch } = useContext(NotificationContext)

  const votedAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.voted,
    onSuccess: (votedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updateAnecdotes = anecdotes.map(anecdote=>anecdote.id===votedAnecdote.id? votedAnecdote : anecdote)
      queryClient.setQueryData(['anecdotes'], updateAnecdotes)
      notificationDispatch({type: 'notification/setMessage', payload: `anecdote '${votedAnecdote.content}' voted`})
      setTimeout(() => {
        notificationDispatch({type: 'notification/resetMessage'})
      }, 5*1000)
    }
  })

  const handleVote = (anecdote) => {
    votedAnecdoteMutation.mutate(anecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false,
    refetchOnWindowFocus: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if(result.isError){
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
