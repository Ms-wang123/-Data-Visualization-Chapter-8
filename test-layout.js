// 图表修复验证测试脚本
const chartContainers = [
    { id: 'contourChart', type: 'plotly' },
    { id: 'streamChart', type: 'plotly' }, 
    { id: 'stemChart', type: 'chartjs' },
    { id: 'dumbbellChart', type: 'plotly' },
    { id: 'ganttChart', type: 'plotly' },
    { id: 'pyramidChart', type: 'plotly' },
    { id: 'funnelChart', type: 'plotly' },
    { id: 'sankeyChart', type: 'plotly' },
    { id: 'treeChart', type: 'plotly' },
    { id: 'waffleChart', type: 'plotly' }
];

// 测试每个图表的尺寸和位置
function testChartLayout() {
    console.log('=== 图表布局修复验证 ===');
    
    chartContainers.forEach(chart => {
        const element = document.getElementById(chart.id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const hasContent = chart.type === 'chartjs' ? 
                element.getContext && element.getContext('2d') :
                element.children.length > 0;
                
            console.log(`${chart.id} (${chart.type}):`);
            console.log(`  - 宽度: ${rect.width}px`);
            console.log(`  - 高度: ${rect.height}px`);
            console.log(`  - 位置: (${rect.left}, ${rect.top})`);
            console.log(`  - 可见性: ${rect.width > 0 && rect.height > 0 ? '✓' : '✗'}`);
            console.log(`  - 内容: ${hasContent ? '✓' : '✗'}`);
            
            // 检查是否居中
            const container = element.closest('.chart-container');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const wrapperRect = container.querySelector('.chart-wrapper').getBoundingClientRect();
                const isCenteredHorizontally = Math.abs(wrapperRect.left - containerRect.left) < 20;
                const isCenteredVertically = Math.abs(wrapperRect.top - containerRect.top) < 20;
                console.log(`  - 水平居中: ${isCenteredHorizontally ? '✓' : '✗'}`);
                console.log(`  - 垂直居中: ${isCenteredVertically ? '✓' : '✗'}`);
                
                // 检查容器类型匹配
                const elementType = chart.type === 'plotly' ? 'DIV' : 'CANVAS';
                const isCorrectType = element.tagName === elementType;
                console.log(`  - 元素类型: ${isCorrectType ? '✓' : '✗'} (${elementType})`);
            }
            console.log('');
        } else {
            console.log(`${chart.id}: ✗ 元素不存在`);
            console.log('');
        }
    });
}

// 测试响应式布局
function testResponsiveLayout() {
    console.log('=== 响应式布局测试 ===');
    const grid = document.querySelector('.charts-grid');
    if (grid) {
        const computedStyle = window.getComputedStyle(grid);
        console.log(`网格布局: ${computedStyle.display}`);
        console.log(`网格列: ${computedStyle.gridTemplateColumns}`);
        console.log(`网格间距: ${computedStyle.gap}`);
    }
}

// 测试图表容器尺寸
function testContainerSizes() {
    console.log('=== 容器尺寸测试 ===');
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach((container, index) => {
        const rect = container.getBoundingClientRect();
        const wrapper = container.querySelector('.chart-wrapper');
        const wrapperRect = wrapper.getBoundingClientRect();
        
        console.log(`容器 ${index + 1}:`);
        console.log(`  - 容器尺寸: ${rect.width}x${rect.height}`);
        console.log(`  - 包装器尺寸: ${wrapperRect.width}x${wrapperRect.height}`);
        console.log(`  - 内边距: ${window.getComputedStyle(container).padding}`);
        console.log('');
    });
}

// 运行所有测试
window.addEventListener('load', () => {
    setTimeout(() => {
        testChartLayout();
        testResponsiveLayout();
        testContainerSizes();
        
        console.log('测试完成！所有图表应该完整显示并居中对齐。');
    }, 3000);
});

// 验证图表完整性
function verifyChartIntegrity() {
    console.log('=== 图表完整性验证 ===');
    
    const expectedCharts = [
        'contourChart',    // 等高线图
        'streamChart',     // 矢量场流线图
        'stemChart',       // 棉棒图
        'dumbbellChart',   // 哑铃图
        'ganttChart',      // 甘特图
        'pyramidChart',    // 人口金字塔
        'funnelChart',     // 漏斗图
        'sankeyChart',     // 桑基图
        'treeChart',       // 树状图
        'waffleChart'      // 华夫饼图
    ];
    
    let validCharts = 0;
    let totalCharts = expectedCharts.length;
    
    expectedCharts.forEach(chartId => {
        const element = document.getElementById(chartId);
        if (element) {
            const container = element.closest('.chart-container');
            const hasTitle = container.querySelector('h3');
            const hasWrapper = container.querySelector('.chart-wrapper');
            const hasControls = container.querySelector('.chart-controls');
            
            const isComplete = hasTitle && hasWrapper && hasControls;
            const isVisible = element.getBoundingClientRect().width > 0;
            
            if (isComplete && isVisible) {
                validCharts++;
                console.log(`✓ ${chartId}: 完整且可见`);
            } else {
                console.log(`✗ ${chartId}: 不完整或不可见`);
                if (!hasTitle) console.log(`  - 缺少标题`);
                if (!hasWrapper) console.log(`  - 缺少包装器`);
                if (!hasControls) console.log(`  - 缺少控件`);
                if (!isVisible) console.log(`  - 不可见`);
            }
        } else {
            console.log(`✗ ${chartId}: 元素不存在`);
        }
    });
    
    console.log(`\n验证结果: ${validCharts}/${totalCharts} 个图表完整显示`);
    console.log(`完成率: ${((validCharts / totalCharts) * 100).toFixed(1)}%`);
    
    return {
        total: totalCharts,
        valid: validCharts,
        percentage: (validCharts / totalCharts) * 100
    };
}

// 导出测试函数供控制台使用
window.chartTests = {
    testChartLayout,
    testResponsiveLayout,
    testContainerSizes,
    verifyChartIntegrity
};