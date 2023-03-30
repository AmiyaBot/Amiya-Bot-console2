import Notice from '@/lib/message'
import HttpRequest from '@/lib/http'
import { StringDict } from '@/lib/common'
import { recordInstalledCount } from '@/request/remote/amiyabotServer'
import { cosHost, cos } from '@/request/remote/cosServer'

const request = new HttpRequest()
const official = 'plugins/official'
const custom = 'plugins/custom'

function getPluginPostData (data: StringDict) {
    const post = {
        url: data.url,
        packageName: '',
        plugin_id: data.plugin_id
    }
    if (data.plugin_type === 'official') {
        post.url = cosHost + `/${official}/${data.plugin_id}-${data.version}.zip`
        post.packageName = `${data.plugin_id}-${data.version}.zip`
    } else {
        post.url = cosHost + `/${custom}/${data.plugin_id}/${data.file}`
        post.packageName = data.file
    }

    return post
}

export async function getInstalledPlugin () {
    return await request.get({
        url: '/plugin/getInstalledPlugin'
    })
}

export async function getPluginConfig (data: StringDict) {
    return await request.post({
        url: '/plugin/getPluginConfig',
        data: data
    })
}

export async function delPluginConfig (data: StringDict) {
    return await request.post({
        url: '/plugin/delPluginConfig',
        data: data
    })
}

export async function getPluginDefaultConfig (data: StringDict) {
    return await request.post({
        url: '/plugin/getPluginDefaultConfig',
        data: data
    })
}

export async function setPluginConfig (data: StringDict) {
    return await request.post({
        url: '/plugin/setPluginConfig',
        data: data
    })
}

export async function getPluginShop () {
    return await cos.get({
        url: `/${official}/plugins.json`
    })
}

export async function installPlugin (data: StringDict) {
    await recordInstalledCount(data)
    return await request.post({
        url: '/plugin/installPlugin',
        data: getPluginPostData(data)
    })
}

export async function upgradePlugin (data: StringDict) {
    if (await Notice.confirm('更新插件前请备份插件的一些配置文件，以防信息丢失。', '请注意', 'warning', ['更新', '去备份'])) {
        return await request.post({
            url: '/plugin/upgradePlugin',
            data: getPluginPostData(data)
        })
    }
}

export async function uninstallPlugin (data: StringDict) {
    if (await Notice.confirm('确定卸载插件【' + data.name + '】')) {
        return await request.post({
            url: '/plugin/uninstallPlugin',
            data
        })
    }
}
