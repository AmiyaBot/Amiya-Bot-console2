import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'

const request = new HttpRequest()

export async function getAllOperator () {
    return await request.get({
        url: '/operator/getAllOperator'
    })
}

export async function getOperator (data: StringDict) {
    return await request.post({
        url: '/operator/getOperator',
        data
    })
}

export async function setOperator (data: StringDict) {
    return await request.post({
        url: '/operator/setOperator',
        data
    })
}
