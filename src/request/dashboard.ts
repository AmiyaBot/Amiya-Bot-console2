import HttpRequest from '@/lib/http'

const request = new HttpRequest()

export async function getLog () {
    return await request.get({
        url: '/dashboard/getLog'
    })
}
