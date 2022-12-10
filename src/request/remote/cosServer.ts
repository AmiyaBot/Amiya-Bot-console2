import HttpRequest from '@/lib/http'

export const cosHost = 'https://cos.amiyabot.com'

export const cos = new HttpRequest({
    host: cosHost
})

export async function getNotice () {
    return await cos.get({
        url: '/notice.txt'
    })
}
