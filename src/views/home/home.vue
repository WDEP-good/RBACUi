<template>
    <div>
        <h1 class="home_title" style="text-align: center;">
            <el-button :icon="ArrowLeft" @click="getPreYearData">上一年</el-button>
            <span>{{ year }}</span>
            <span>年学员数量</span>
            <el-button @click="getNextYearData">下一年<el-icon>
                    <ArrowRight />
                </el-icon></el-button>
        </h1>
        <div id="myChart" style="height: 500px;"></div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { ref,onMounted } from 'vue';
// 导入请求每年学员数据的接口
import { reqStudentsForYear } from '@/api/student/index';
// 定义ref数据用于获取当前年份
const year = ref(new Date().getFullYear());
// 点击上一年按钮触发的点击事件
const getPreYearData = () => {
    year.value--
    drawChart()
}
// // 点击下一年按钮触发的点击事件
const getNextYearData = () => {
    year.value++
    drawChart()
}
onMounted(() => {
    drawChart()
})

const drawChart = () => {
    reqStudentsForYear(year.value).then((response) => {
        const res = response
        // 判断是否获取成功
        if (res.status == '0') {
            // 获取成功就获取dom元素
            var chartDom = document.getElementById('myChart');
            // 初始化echarts实例
            var myChart = echarts.init(chartDom);
            // 要显示的数据（学员的数量），默认给0，显示y轴
            let dataArr = [0]
            if (res.data && res.data.length) {
                res.data.forEach(item => {
                    // parseInt取整去掉小数点
                    // 注意：这里要-1，因为dataArr数据是从0开始
                    dataArr[parseInt(item._id) - 1] = item.count
                })
            } else {
                console.log("当前年份没有数据");
            }
            var option = {
                // x轴图标
                xAxis: {
                    type: 'category',
                    data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                },
                // y轴图标
                yAxis: {
                    type: 'value',
                },
                // 显示数据
                series: [
                    {
                        data: dataArr,
                        type: 'bar',
                    }
                ]
            }
            option && myChart.setOption(option);
        }

    })
}



// // 基于准备好的dom，初始化echarts实例
// var myChart = echarts.init(document.getElementById('myChart'));
// // 绘制图表
// myChart.setOption({
//     title: {
//         text: 'ECharts 入门示例'
//     },
//     tooltip: {},
//     xAxis: {
//         data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
//     },
//     yAxis: {},
//     series: [
//         {
//             name: '销量',
//             type: 'bar',
//             data: [5, 20, 36, 10, 10, 20]
//         }
//     ]
// }); 
</script>

<style scoped></style>