<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
    <div :style="{ background: 'rgb(190, 200, 200)', padding: '26px 16px 16px' }">
        <a-button type="primary" ghost>Primary</a-button>
        <a-button ghost>Default</a-button>
        <a-button type="dashed" ghost>Dashed</a-button>
        <a-button type="primary" danger ghost>Danger</a-button>
        <Space direction="vertical">
            <Space wrap>
                <Button>Default</Button>
                <Button type="primary">Primary</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
            </Space>
            <Space wrap>
                <Button type="info">Info</Button>
                <Button type="success">Success</Button>
                <Button type="warning">Warning</Button>
                <Button type="error">Error</Button>
            </Space>
        </Space>
    </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
