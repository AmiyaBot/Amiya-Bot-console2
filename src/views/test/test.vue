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
                            <div>
                                {{ item.name }}
                                <span class="time">{{ item.time }}</span>
                                <el-icon v-if="item.type === 'me'" class="resend" @click="resend(item)">
                                    <refresh-left></refresh-left>
                                </el-icon>
                            </div>
                            <el-card shadow="always" :body-style="{ padding: '10px' }">
                                <span class="content" v-for="(n, i) in item.content" v-html="n" :key="i"></span>
                                <template v-for="(n, i) in item.images" :key="i">
                                    <div style="margin: 5px 0"></div>
                                    <el-image style="height: 100px" fit="contain" :src="n"/>
                                    <div style="margin: 5px 0"></div>
                                </template>
                            </el-card>
                        </div>
                    </div>
                </div>
                <div class="selected-images">
                    <div v-for="(item, index) in selectedImages" :key="index" style="padding-right: 15px">
                        <el-badge :value="index + 1" type="primary">
                            <el-image class="image" :src="item" fit="contain" @click="selectedImages.splice(index, 1)"/>
                        </el-badge>
                    </div>
                </div>
                <div class="input-area">
                    <el-input v-model="message" placeholder="输入对话内容，按回车发送..." @keyup.enter="send"/>
                    <el-button style="margin-left: 10px" type="primary" @click="send">发送</el-button>
                    <el-button style="margin-left: 10px" @click="$refs.imageSelector.click()">选择图片...</el-button>
                </div>
            </div>
        </el-card>
    </div>

    <input type="file" accept="image/*" style="display: none" multiple ref="imageSelector">
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { RefreshLeft } from '@element-plus/icons-vue'
import Common, { StringDict } from '@/lib/common'
import TestConfig from '@/views/test/testConfig.vue'

@Options({
    components: {
        TestConfig,
        RefreshLeft
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
            if (this.message !== '' || this.selectedImages.length) {
                this.chatList.push({
                    type: 'me',
                    name: this.$refs.config.form.nickname || 'User',
                    content: this.message !== '' ? [this.message] : [],
                    images: this.selectedImages,
                    time: Common.formatDate(new Date())
                })

                this.$refs.config.send(this.message, this.selectedImages)

                this.message = ''
                this.selectedImages = []
            }
        },
        resend (item: StringDict) {
            this.chatList.push({
                ...item,
                name: this.$refs.config.form.nickname || 'User',
                time: Common.formatDate(new Date())
            })
            this.$refs.config.send(item.content[0], item.images)
        },
        recv (data: StringDict) {
            const content = []
            const voices = []

            for (const item of data.event_data) {
                switch (item.type) {
                    case 'text':
                        if (item.data === '\n') {
                            item.data = '<div style="margin: 5px 0"></div>'
                        }
                        content.push(item.data)
                        break
                    case 'face':
                        content.push(`[face${item.data}]`)
                        break
                    case 'image':
                        content.push(`<div style="margin: 5px 0"></div><img class="chat-image" src="${item.data}" alt="image"><div style="margin: 5px 0"></div>`)
                        break
                    case 'voice':
                        voices.push(`
                            <audio controls>
                                <source src="${item.data}" type="${item.audio_type}">
                            </audio>
                        `)
                        break
                }
            }

            if (content.length) {
                this.chatList.push({
                    type: 'bot',
                    name: 'AmiyaBot',
                    content: content,
                    images: [],
                    time: Common.formatDate(new Date())
                })
            }
            if (voices.length) {
                for (const item of voices) {
                    this.chatList.push({
                        type: 'bot',
                        name: 'AmiyaBot',
                        content: [item],
                        images: [],
                        time: Common.formatDate(new Date())
                    })
                }
            }
        }
    },
    data () {
        return {
            message: '',
            selectedImages: [],
            chatList: [],
            avatar: {
                bot: require('../../assets/art/bot.jpg'),
                me: require('../../assets/art/me.jpg')
            }
        }
    },
    mounted () {
        this.$refs.imageSelector.addEventListener('change', () => {
            const { files } = this.$refs.imageSelector

            for (const item of files) {
                this.selectedImages.push(
                    URL.createObjectURL(item)
                )
            }
            this.$refs.imageSelector.value = ''
        })
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
            display: flex;
            flex-direction: column;

            .chat-panel {
                flex: 2;
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

            .selected-images {
                display: flex;
                overflow: auto;
                padding: 15px 10px 0;

                .image {
                    width: 100px;
                    height: 100px;
                    box-shadow: 0 0 4px 0 #d3d3d3;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }

            .input-area {
                width: 100%;
                margin-top: 10px;
                display: flex;
            }
        }
    }

    .resend:hover {
        cursor: pointer;
        color: #03A9F4;
    }
}
</style>
<style>
.chat-image {
    max-width: 500px;
}
</style>
