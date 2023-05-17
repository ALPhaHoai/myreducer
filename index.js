import _ from 'lodash'
import {useMemo, useReducer} from 'react'

export default function useMyReducer(reducer, initState, init, onChange) {
    const [state, _dispatch] = useReducer((state, action) => {
        const result = reducer(state)[action.method].apply(null, action.payload)

        if(typeof onChange === 'function' && !_.isEqual(state, result)) {
            onChange({
                prevState: state,
                currentState: result,
            })
        }

        return result
    }, initState, init)

    const dispatch = useMemo(() => {
        return Object.keys(reducer()).reduce(function (previousValue, method, currentIndex, array) {
            previousValue[method] = (...payload) => {
                _dispatch({
                    method: method,
                    payload: payload
                })
            }
            return previousValue
        }, {})
    }, [reducer])

    return [state, dispatch, init]
}

