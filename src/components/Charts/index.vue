<template>
  <div ref="chartRef" style="height: 100%; width: 100%"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps(["option"]);

// 使用 ref 来创建一个对 div 元素的引用
const chartRef = ref(null);

let chartInstance: echarts.ECharts;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.error("图表容器不可用。");
    return;
  }
  try {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(props.option);
  } catch (error) {
    console.error("无法加载图标：", error);
  }
};

// 当组件挂载时调用的函数，用于初始化图表并添加窗口大小调整的监听器
onMounted(() => {
  initChart();
  // 监听窗口大小改变，并重新调整图表大小
  window.addEventListener("resize", () => {
    chartInstance.resize();
  });
});

// 当组件卸载时调用的函数，用于释放echarts实例资源
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});

// 监听props.option的变化，以更新图表选项
watch(
  () => props.option,
  (newOption: any) => {
    chartInstance.setOption(newOption);
  }
);
</script>
