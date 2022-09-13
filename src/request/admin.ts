import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

const request = new HttpRequest()

export async function getAdminList (data: StringDict) {
    return await request.post({
        url: '/admin/getAdmin',
        data
    })
}

export async function addAdmin (data: StringDict) {
    return await request.post({
        url: '/admin/addAdmin',
        data
    })
}

export async function delAdmin (data: StringDict) {
    return await request.post({
        url: '/admin/deleteAdmin',
        data
    })
}
