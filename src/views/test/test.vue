<template>
    <div class="header">
        <div class="title">
            AmiyaBot Test
        </div>
    </div>
    <div class="body">
        <test-config ref="config" @recv="recv"></test-config>
        <el-card class="chat" :body-style="{ height: 'calc(100% - 53px)' }">
            <template #header>
                <span>对话窗口</span>
            </template>
            <div class="card-content">
                <div class="chat-panel" ref="panel">
                    <div class="chat-item" :class="item.type" v-for="(item, index) in chatList" :key="index">
                        <img class="avatar" :src="avatar[item.type]" alt="avatar">
                        <div class="chat-content">
                            <div>{{ item.name }}<span class="time">{{ item.time }}</span></div>
                            <el-card shadow="always" :body-style="{ padding: '10px' }">
                                <span class="content" v-for="(n, i) in item.content" v-html="n" :key="i"></span>
                            </el-card>
                        </div>
                    </div>
                </div>
                <div class="input-area">
                    <el-input v-model="message" placeholder="输入对话内容，按回车发送..." @change="send"/>
                    <el-button style="margin-left: 10px" type="primary" @click="send">发送</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Common, { StringDict } from '@/lib/common'
import TestConfig from '@/views/test/testConfig.vue'

@Options({
    components: {
        TestConfig
    },
    watch: {
        chatList: {
            handler () {
                this.$nextTick(() => {
                    this.$refs.panel.scrollTop = this.$refs.panel.scrollHeight
                })
            },
            deep: true
        }
    },
    methods: {
        send () {
            this.chatList.push({
                type: 'me',
                name: this.$refs.config.form.nickname || 'User',
                content: [this.message],
                time: Common.formatDate(new Date())
            })
            this.$refs.config.send(this.message)
            this.message = ''
        },
        recv (data: StringDict) {
            const content = []

            for (const item of data.event_data) {
                if (item.type === 'text') {
                    if (item.data === '\n') {
                        item.data = '<div style="margin: 5px 0"></div>'
                    }
                    content.push(item.data)
                }
                if (item.type === 'image') {
                    content.push(`<img class="chat-image" src="data:image/png;${item.data}" alt="image">`)
                }
            }

            this.chatList.push({
                type: 'bot',
                name: 'AmiyaBot',
                content: content,
                time: Common.formatDate(new Date())
            })
        }
    },
    data () {
        return {
            message: '',
            chatList: [],
            avatar: {
                bot: require('../../assets/art/bot.jpg'),
                me: require('../../assets/art/me.jpg')
            }
        }
    }
})
export default class Test extends Vue {

}
</script>

<style scoped lang="scss">
.header {
    height: 50px;
    padding: 0 20px;
    color: #fff;
    background: var(--c-main);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
        font-size: 20px;
        display: flex;
        align-items: center;
    }
}

.body {
    width: 100%;
    height: calc(100% - 50px);
    padding: 20px;
    display: flex;

    .chat {
        width: 65%;
        height: 100%;

        .card-content {
            height: 100%;

            .chat-panel {
                height: calc(100% - 42px);
                padding: 10px 20px;
                overflow: auto;

                .chat-item {
                    margin-bottom: 20px;
                    display: flex;

                    &.me {
                        flex-direction: row-reverse;

                        .chat-content {
                            align-items: flex-end;

                            & > div:first-child {
                                flex-direction: row-reverse;
                            }
                        }
                    }

                    .avatar {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 1px solid var(--el-color-primary);
                    }

                    .chat-content {
                        padding: 0 10px;
                        display: flex;
                        flex-direction: column;

                        & > div:first-child {
                            font-size: 16px;
                            font-weight: bold;
                            margin-bottom: 5px;
                            display: flex;
                            align-items: center;

                            span {
                                font-size: 12px;
                                font-weight: normal;
                                color: var(--el-color-info-dark-2);
                                padding: 0 10px;
                            }
                        }
                    }
                }
            }

            .input-area {
                width: 100%;
                margin-top: 10px;
                display: flex;
            }
        }
    }
}
</style>
<style>
.chat-image {
    max-width: 500px;
}
</style>
