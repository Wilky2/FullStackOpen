import deepFreeze from 'deep-freeze'
import { describe, test } from 'vitest'
import notificationReducer from './notificationReducer'
import { setNotification } from './notificationReducer'

describe('notification reducer', ()=>{

    test('notificationReducer is immutable', () => {
        const initialState = 'render here notification...'
        deepFreeze(initialState)
        notificationReducer(initialState, setNotification("Testing value"))
    })

})