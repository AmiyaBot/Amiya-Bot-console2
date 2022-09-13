import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

const request = new HttpRequest()

export async function getUserList (data: StringDict) {
    return await request.post({
        url: '/user/getUser',
        data
    })
}

export async function editUser (data: StringDict) {
    return await request.post({
        url: '/user/editUser',
        data
    })
}
