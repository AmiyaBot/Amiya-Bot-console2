import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

const request = new HttpRequest()

export async function getInstanceList () {
    return await request.get({
        url: '/bot/getAllBot'
    })
}

export async function submitInstance (data: StringDict) {
    return await request.post({
        url: data.id ? '/bot/editBot' : '/bot/addBot',
        data
    })
}

export async function closeInstance (data: StringDict) {
    return await request.post({
        url: '/bot/stopBot',
        data
    })
}

export async function runInstance (data: StringDict) {
    return await request.post({
        url: '/bot/runBot',
        data
    })
}

export async function deleteInstance (data: StringDict) {
    return await request.post({
        url: '/bot/deleteBot',
        data
    })
}
