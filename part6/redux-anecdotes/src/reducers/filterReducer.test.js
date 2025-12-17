import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import filterReducer from './filterReducer'
import { filterChange } from './filterReducer'

describe('filter reducer', ()=>{

    test('filter changed', () => {
        const initialState = ''
        deepFreeze(initialState)
        const newState = filterReducer(initialState, filterChange('value'))
        expect(newState).toStrictEqual('value')
    })

})