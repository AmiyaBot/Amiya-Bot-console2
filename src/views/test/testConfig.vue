<template>
    <div class="config">
        <el-divider content-position="left">连接测试服务</el-divider>
        <el-form label-width="120px">
            <el-form-item label="测试地址">
                <el-input v-model="host"/>
            </el-form-item>
            <el-form-item label="APP ID">
                <el-input v-model="appid"/>
            </el-form-item>
            <el-form-item>
                <el-button v-if="!isConnected" type="success" @click="connect">连接</el-button>
                <el-button v-else type="danger" @click="clean">断开连接</el-button>
                <span>
                    <i class="state" :class="{ ok: isConnected }"></i>
                    <template v-if="isConnected">已连接</template>
                    <template v-else>未连接</template>
                </span>
            </el-form-item>
        </el-form>
        <el-divider content-position="left" style="margin-top: 50px">模拟信息设置</el-divider>
        <el-form label-width="120px">
            <el-form-item label="用户ID">
                <el-input v-model="form.user_id"/>
            </el-form-item>
            <el-form-item label="用户昵称">
                <el-input v-model="form.nickname"/>
            </el-form-item>
            <el-form-item label="群组ID">
                <el-input v-model="form.channel_id"/>
            </el-form-item>
            <el-form-item label="消息类型">
                <el-input v-model="form.message_type"/>
            </el-form-item>
            <el-form-item label="是否管理员">
                <el-switch v-model="form.is_admin"/>
            </el-form-item>
        </el-form>
        <el-divider content-position="left" style="margin-top: 50px">事件模拟</el-divider>
        <el-form label-width="120px">
            <el-form-item label="事件名">
                <el-input v-model="event.event_name"/>
            </el-form-item>
            <el-form-item label="事件数据">
                <el-input type="textarea" v-model="event.event_data"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="sendEvent">发送</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Notice from '@/lib/message'

async function toBase64 (url: string) {
    return new Promise(resolve => {
        const img = new Image()

        img.src = url
        img.onload = function () {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height

            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0, img.width, img.height)

            const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
            const dataURL = canvas.toDataURL('image/' + ext)

            resolve(dataURL)
        }
    })
}

@Options({
    methods: {
        connect () {
            if (!this.isConnected) {
                const client = new WebSocket(`ws://${this.host}/${this.appid}`)

                client.onopen = () => {
                    this.client = client
                    this.isConnected = true

                    localStorage.setItem('test-host', this.host)
                    localStorage.setItem('test-appid', this.appid)

                    Notice.toast('连接成功')
                }
                client.onclose = () => {
                    this.isConnected = false
                    this.clean()

                    Notice.toast('连接失败', 'error')
                }
                client.onmessage = evt => {
                    this.$emit('recv', JSON.parse(evt.data))
                }
                client.onerror = evt => {
                    this.clean()
                    console.log('websocket closed.', evt)
                }
            }
        },
        async send (message: string, images: string[] = []) {
            const imgData = []

            for (const item of images) {
                imgData.push(await toBase64(item))
            }

            this.client.send(JSON.stringify({
                event: 'message',
                event_id: new Date().getTime().toString(),
                event_data: {
                    ...this.form,
                    message: message,
                    images: imgData
                }
            }))
        },
        sendEvent () {
            let eventData = this.event.event_data
            try {
                eventData = JSON.parse(eventData)
            } catch (e) {

            }
            this.client.send(JSON.stringify({
                event: this.event.event_name,
                event_id: new Date().getTime().toString(),
                event_data: eventData
            }))
        },
        clean () {
            localStorage.removeItem('test-host')
            localStorage.removeItem('test-appid')

            if (this.client) {
                this.client.close()
                this.client = null
            }
        }
    },
    data () {
        return {
            host: localStorage.getItem('test-host') || '127.0.0.1:32001',
            appid: localStorage.getItem('test-appid') || 'test',
            client: null,
            isConnected: false,
            form: {
                user_id: '',
                channel_id: '',
                message_type: 'group',
                nickname: 'User',
                is_admin: true
            },
            event: {
                event_name: '',
                event_data: ''
            }
        }
    },
    mounted () {
        if (this.host && this.appid) {
            this.connect()
        }
    }
})
export default class TestConfig extends Vue {

}
</script>

<style scoped lang="scss">
.config {
    width: 35%;
    padding-right: 20px;

    .state {
        width: 10px;
        height: 10px;
        margin-left: 10px;
        margin-right: 5px;
        border-radius: 50%;
        background: #f44336;
        display: inline-block;

        &.ok {
            background: #67c23a;
        }
    }
}
</style>
