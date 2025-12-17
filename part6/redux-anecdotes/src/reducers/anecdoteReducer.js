import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    votedAnecdote(state, action){
      const votedAnecdote = action.payload
      return state.map(anecdote => anecdote.id === votedAnecdote.id ? votedAnecdote : anecdote)
    },
    createdAnecdote(state, action){
      const anecdote = action.payload
      state.push(anecdote)
    },
    setAnecdotes(_state, action) {
      return action.payload
    }
  }
})

const { setAnecdotes, createdAnecdote, votedAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createdAnecdote(newAnecdote))
  }
}

export const voted = (anecdote) => {
  return async (dispatch) => {
    const anecdoteVoted = await anecdoteService.voted(anecdote)
    dispatch(votedAnecdote(anecdoteVoted))
  }
}

export default anecdoteSlice.reducer
