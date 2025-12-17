import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {

  const queryClient = useQueryClient()

  const { notificationDispatch } = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notificationDispatch({type: 'notification/setMessage', payload: `anecdote '${newAnecdote.content}' created`})
      setTimeout(() => {
        notificationDispatch({type: 'notification/resetMessage'})
      }, 5*1000)
    },
    onError: (error) => {
      if(error.status===400){
        notificationDispatch({type: 'notification/setMessage', payload: `${error.body.error}`})
        setTimeout(() => {
          notificationDispatch({type: 'notification/resetMessage'})
        }, 5*1000)
      }
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
