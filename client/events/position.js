import event from './index'
import axios from 'axios'

const interval = 3000

export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        }, err => {
           console.log(err) 
           reject(err)
        }, {
            maximumAge: 0,
            timeout: 6000,
            enableHighAccuracy: true,
        })
    })
}

let intervalId = null

async function emitPositionEvent() {
    try {
        let position = await getCurrentPosition()
        event.emit('position', position)
        axios.put('/users/position', position)
        return position
    }
    catch(e) {
        event.emit('error', e)
    }
}

export async function start() {
    await emitPositionEvent()
    if (intervalId != null) return intervalId
    intervalId = setInterval(async () => {
        await emitPositionEvent()
    }, interval)
    return intervalId
}

export function stop() {
    if (intervalId != null) {
        clearInterval(intervalId)
    }
    return intervalId
}

export default { start, stop, getCurrentPosition }
