import HttpRequest from '@/lib/http'

const request = new HttpRequest()

export async function getLog () {
    return await request.get({
        url: '/dashboard/getLog'
    })
}

export async function getMessageRecord (appid: string) {
    return await request.get({
        url: '/dashboard/getMessageRecord',
        data: {
            appid
        }
    })
}
