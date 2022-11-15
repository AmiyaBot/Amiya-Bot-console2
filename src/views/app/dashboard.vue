<template>
    <div>
        <logger/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Logger from '@/views/app/dashboardElem/logger.vue'

@Options({
    components: {
        Logger
    }
})
export default class Dashboard extends Vue {
}
</script>

<style scoped lang="scss">

</style>
