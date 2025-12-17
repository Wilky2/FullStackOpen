import deepFreeze from 'deep-freeze'
import { describe, test } from 'vitest'
import anecdoteReducer from './anecdoteReducer'
import {  initializeAnecdotes } from './anecdoteReducer'

describe('anecdote reducer', () => {

    test('anecdoteReducer is immutable', async () => {
        const initialState = []
        deepFreeze(initialState)
        anecdoteReducer(initialState, initializeAnecdotes())
    })

})
