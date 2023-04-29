<template>
    <div>
        <a-table
                :columns="columns"
                :data-source="userData"
                :pagination="pagination"
                bordered
        >
            <template #headerCell="{ column }">
                <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          Name
        </span>
                </template>
            </template>

            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                    <a>
                        {{ record.name }}
                    </a>
                </template>
                <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
                  v-for="tag in record.tags"
                  :key="tag"
                  :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
                </template>
                <template v-else-if="column.key === 'operation'">
        <span>
          <a>详细信息</a>
          <a-divider type="vertical"/>
          <a>删除</a>
          <a-divider type="vertical"/>
          <a>编辑</a>
        </span>
                </template>
            </template>
            <!--            表格上面-->
            <template #title>
                <a-button>添加</a-button>

                <a-input-search
                        v-model:value="searchText"
                        placeholder="请输入搜索的关键字"
                        size="middle"
                        style="width: 200px"
                        @search="onSearch"
                />
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import {SmileOutlined, DownOutlined} from '@ant-design/icons-vue';
import {onMounted, reactive, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {message} from "ant-design-vue";

const searchText = ref('')
const current = ref(1)
const pageSize = ref(10)
// 分页插件
const pagination = reactive({
    total: 0,
    defaultCurrent: current.value,
    defaultPageSize: pageSize.value,
    showTotal: total => `共 ${total} 条数据`,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15'],
    onShowSizeChange: (pageNum, pagesize) => {
        current.value = pageNum;
        pageSize.value = pagesize;
        pageQuery();
    },
    position: ['bottomCenter'],
    change: (pageNum, pagesize) => {
        current.value = pageNum;
        pageSize.value = pagesize;
    }
})

const columns = [
    {
        title: '账号',
        dataIndex: 'userAccount',
        key: 'userAccount',
    },
    {
        title: '昵称',
        dataIndex: 'userName',
        key: 'userName',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: '状态',
        dataIndex: 'userStatus',
        key: 'userStatus',
    },
    {
        title: '角色',
        key: 'userRole',
        dataIndex: 'userRole',
    },
    {
        title: '操作',
        key: 'operation',
        width: 200
    },
];
// mock 数据
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

interface userData {
    userAccount: string,
    userName: string,
    userAvatar: string,
    gender: string,
    userProfile: string,
    userRole: string,
    age: number,
    userStatus: number,
    createTime: Date,
}

const queryRequest = reactive({
    current: current.value,
    pageSize: pageSize.value,
    searchText: searchText.value
})
const pageQuery = async () => {
    const res = await myAxios.post('/user/list/page', queryRequest)
    if (res.code === 0) {
        userData.value = res.data.userList
        pagination.total = res.data.total
    } else {
        message.error('获取数据出错!')
    }
}
const userData = ref([])
onMounted(async () => {
    await pageQuery()
    // const res = await myAxios.get('/user/list')
    // if (res.code === 0) {
    //     userData.value = res.data
    //     console.log(userData.value)
    // } else {
    //     message.error('获取出错!')
    // }
})
</script>

<style lang="less" scoped>

</style>