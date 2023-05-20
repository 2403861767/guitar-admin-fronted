<template>
    <div>
        <div style="display: flex">
            <div style="flex: 1">
                <el-input v-model="searchText" style="width: 200px" size="middle"
                          placeholder="请输入搜索关键字"
                          :prefix-icon="Search" disabled
                          @clear="removeAll" @change="searchUser" clearable/>
            </div>
            <div>
                <el-button @click="doAdd"  type="primary">添加图片</el-button>
            </div>
        </div>
        <el-table :data="imageList" style="width: 100%;margin-top: 20px;" border>
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="musicId" label="音乐id"/>
            <el-table-column prop="imgUrl" width="80" label="音乐图片">
                <template #default="scope">
                    <a-image
                        :width="30"
                        :src="scope.row.imgUrl"
                        :preview="scope.row.imgUrl"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="musicName" label="音乐名"/>
            <el-table-column prop="createTime" label="创建时间"/>
            <el-table-column prop="operation" label="操作" width="200">
                <template #default="scope">
                    <el-button @click="showDetail(scope.row.id)" link size="large">详细</el-button>
                    <el-button @click="doUpdate(scope.row)" link type="primary" size="large">修改</el-button>
                    <el-popconfirm @confirm="del(scope.row.id)" title="确定删除吗">
                        <template #reference>
                            <el-button link type="danger" size="large">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>
        <!--         分页-->
        <el-pagination
                style="justify-content: center;margin-top: 20px;"
                v-model:current-page="current"
                v-model:page-size="pageSize"
                background
                layout="prev, pager, next, total"
                :total="total"
                @current-change="handleCurrentChange"
        />
        <!--编辑或者添加 的对话框-->
        <el-dialog
                v-model="dialogVisible"
                :title="`${addOrUpdate}谱子`"
                width="30%"
        >
            <el-form :model="formData" ref="formRef">
                <el-form-item prop="musicId" label="音乐id">
                    <el-input v-model="formData.musicId" autocomplete="off"/>
                </el-form-item>
                <el-form-item prop="imgUrl" label="图片">
                    <van-uploader :after-read="afterRead" :max-count="1"  v-model="imgUrls" />
                </el-form-item>
            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="doCancel">取消</el-button>
        <el-button type="primary" @click="doConfirm">
          确定
        </el-button>
      </span>
            </template>
        </el-dialog>

        <!--        抽屉/遮罩层-->
        <a-drawer
                v-model:visible="visible"
                class="custom-class"
                style="color: red"
                title="详细信息"
                placement="right"
                width="500px"
                @after-visible-change="afterVisibleChange"
        >
            <div style="font-size: 20px">
                <div>
                    <span>音乐名：</span>
                    <span>{{ detailMusic.musicName }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>歌手：</span>
                    <span>{{ detailMusic.singer }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>描述：</span>
                    <span>{{ detailMusic.musicDescription }}</span>
                </div>
                <div  style="margin-top: 20px;">
                    <span>谱子：</span>
<!--                    TODO 待完善-->
<!--                    <span v-if="imgList.value=={}">暂无谱子</span>-->
                       <a-image
                           v-for="item in imgList"
                           :width="80"
                           :src="item"
                           :preview="item"
                       />
                </div>
                <div style="margin-top: 20px;">
                    <span>难度：</span>
                    <span>{{ detailMusic.difficult }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>价格：</span>
                    <span>{{ detailMusic.price }}元</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>状态：</span>
                    <span>{{ detailMusic.status }}</span>
                </div>
                <div style="margin-top: 20px;">
                    <span>创建时间：</span>
                    <span>{{ detailMusic.createTime }}</span>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts" setup>
import {Search} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {FormInstance, message} from "ant-design-vue";
import {UserOutlined} from "@ant-design/icons-vue";

const visible = ref(false)
const addOrUpdate = ref('添加')
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const imageList = ref([])
const formData = reactive({
    id: 0,
    musicId: 0,
    imgUrl: '',
})


// 分页
const searchText = ref('')
const total = ref(0);
const current = ref(1)
const pageSize = ref(5)
// 分页参数
const params = {
    current: current.value,
    pageSize: pageSize.value,
}
// 分页
const handleCurrentChange = async (val) => {
    current.value = val
    params.current = val
    // console.log("current ->", current.value)
    // console.log("params.current -> ", params.current)
    await getImageList()
}
// const searchUser = async (value) => {
//     params.current = 1
//     current.value = 1
//     searchText.value = value
//     params.searchText = value
//     await getImageList()
// }
// 重置查询
const removeAll = async () => {
    params.current = 1
    current.value = 1
    searchText.value = ''
    await getImageList()
}
// 分页查询
const getImageList = async () => {
    const res = await myAxios.post('/image/list/page', params)
    if (res.code === 0) {
        // imageList.value = res.data.imageList
        let tempList = res.data.musicImageList

        imageList.value = tempList
        total.value = res.data.total
        message.success('获取数据成功')
    } else {
        message.error("获取数据失败")
    }
}


// 新增或者更新
// 新增操作

// 上传谱子
const imgUrlList = ref([])
const imgUrls = ref([])
const afterRead =async (file) => {
    // 此时可以自行将文件上传至服务器
    console.log('afterRead',file);
    const res = await myAxios.post('/oss/upload',file, {
        headers: {"Content-Type": "multipart/form-data"}
    })
    if (res.code === 0){
        // imgUrls.value.push(res.data)
        formData.imgUrl = res.data
        console.log( ' formData.imgUrl -> ',formData.imgUrl)
    }


};


const doAdd = () => {
    dialogVisible.value = true
    addOrUpdate.value = '添加'
}
const doUpdate =  (row) => {
    console.log('row ->', row)
    dialogVisible.value = true
    addOrUpdate.value = '修改'
    const tempUser = row
    formData.id = tempUser.id
formData.musicId = row.musicId
    imgUrls.value = [{url: row.imgUrl}]
    console.log('imgUrls.value',imgUrls.value[0])
}
const doConfirm = async () => {

    const addRequest = reactive({
        musicId: formData.musicId,
        imgUrl: formData.imgUrl,
    })

    const musicImage = reactive({
        id: formData.id,
        musicId: formData.musicId,
        imgUrl: formData.imgUrl,
    })
    // 1. 判断是新增还是删除
    if (addOrUpdate.value === '添加') {
        const res = await myAxios.post('/image/add', addRequest)
        if (res.code === 0) {
            message.success('添加成功')
            await doCancel()
            // dialogVisible.value = false
            // // 清空表单
            // formRef.value?.resetFields()
            await removeAll()
        } else {
            message.error('添加失败')
        }
    } else {
        const res = await myAxios.post('/image/update', musicImage)
        if (res.code === 0) {
            message.success('修改成功')
            doCancel()
            // dialogVisible.value = false
            // // 清空表单
            // formRef.value?.resetFields()
            await removeAll()
        } else {
            message.error('修改失败')
        }
    }
}
// 取消表单
const doCancel = () => {
    dialogVisible.value = false
    // 清空表单
    // resetForm(formRef.value)
    formRef.value?.resetFields()
}
// 删除用户
const del = async (id) => {
    const res = await myAxios.post('/music/delete/'+id)
    if (res.code === 0) {
        message.success('删除成功!')
        await removeAll()
    } else {
        message.error('删除失败!')
    }

}


// 谱子详情
const detailMusic = ref({})
const imgList = ref()
/**
 * 显示用户详细信息
 */
const showDetail = async (id) => {
    visible.value = true
    const res = await myAxios.get('/music/get/' + id)
    if (res.code === 0) {
        detailMusic.value = res.data
        if (detailMusic.value.status === 0) {
            detailMusic.value.status = '待审核'
        } else if (detailMusic.value.status === 1) {
            detailMusic.value.status = '审核通过'
        } else {
            detailMusic.value.status = '审核未通过'
        }
        message.success('获取成功!')
        imgList.value = res.data.imgUrls
        // console.log(detailMusic.value)
        console.log('imgList.value',imgList.value)
    } else {
        message.error('获取失败!')
    }
}
onMounted(async () => {
    await getImageList()

})
</script>

<style lang="less" scoped>

</style>