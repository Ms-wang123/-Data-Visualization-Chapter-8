// 数据可视化交互脚本
class DataVisualizationDashboard {
    constructor() {
        this.charts = {};
        this.dataRange = 100;
        this.currentChartType = 'all';
        this.currentTheme = 'default';
        this.customStyles = {};
        this.dragDropMode = false;
        this.initializeEventListeners();
        this.initializeCharts();
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 图表选择
        document.getElementById('chartSelect').addEventListener('change', (e) => {
            this.filterCharts(e.target.value);
        });

        // 数据范围滑块
        document.getElementById('dataRange').addEventListener('input', (e) => {
            this.dataRange = e.target.value;
            document.getElementById('dataRangeValue').textContent = `${this.dataRange}%`;
            this.updateAllCharts();
        });

        // 刷新数据按钮
        document.getElementById('refreshData').addEventListener('click', () => {
            this.refreshAllData();
        });

        // 导出图表按钮
        document.getElementById('exportCharts').addEventListener('click', () => {
            this.exportCharts();
        });

        // 新增功能事件监听器
        document.getElementById('chartTypeSelector').addEventListener('change', (e) => {
            this.changeChartType(e.target.value);
        });

        document.getElementById('themeColor').addEventListener('input', (e) => {
            this.updateThemeColor(e.target.value);
        });

        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.updateFontSize(e.target.value);
        });

        document.getElementById('toggleDragMode').addEventListener('click', () => {
            this.toggleDragDropMode();
        });

        document.getElementById('openStyleModal').addEventListener('click', () => {
            document.getElementById('styleModal').style.display = 'block';
        });

        // 拖放相关事件
        document.getElementById('closeDragArea').addEventListener('click', () => {
            this.closeDragDropArea();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        const dragDropZone = document.getElementById('dragDropZone');
        dragDropZone.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        dragDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragDropZone.classList.add('drag-over');
        });

        dragDropZone.addEventListener('dragleave', () => {
            dragDropZone.classList.remove('drag-over');
        });

        dragDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dragDropZone.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files);
        });

        // 样式模态框
        document.querySelector('.close-style')?.addEventListener('click', () => {
            document.getElementById('styleModal').style.display = 'none';
        });

        document.getElementById('applyStyles')?.addEventListener('click', () => {
            this.applyCustomStyles();
        });

        document.getElementById('resetStyles')?.addEventListener('click', () => {
            this.resetStyles();
        });

        document.getElementById('saveStyles')?.addEventListener('click', () => {
            this.saveStylePreset();
        });

        // 模态框控制
        const modal = document.getElementById('dataModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // 各个图表的自定义数据按钮
        document.getElementById('customizeStemData').addEventListener('click', () => {
            this.openCustomDataModal('stem');
        });

        document.getElementById('customizeDumbbellData').addEventListener('click', () => {
            this.openCustomDataModal('dumbbell');
        });

        document.getElementById('customizeGanttData').addEventListener('click', () => {
            this.openCustomDataModal('gantt');
        });

        document.getElementById('customizePyramidData').addEventListener('click', () => {
            this.openCustomDataModal('pyramid');
        });

        document.getElementById('customizeFunnelData').addEventListener('click', () => {
            this.openCustomDataModal('funnel');
        });

        document.getElementById('customizeSankeyData').addEventListener('click', () => {
            this.openCustomDataModal('sankey');
        });

        document.getElementById('customizeWaffleData').addEventListener('click', () => {
            this.openCustomDataModal('waffle');
        });

        // 图表参数控制
        document.getElementById('contourDensity').addEventListener('input', () => {
            this.updateContourChart();
        });

        document.getElementById('contourLevels').addEventListener('input', () => {
            this.updateContourChart();
        });

        document.getElementById('streamDensity').addEventListener('input', () => {
            this.updateStreamChart();
        });

        document.getElementById('stemShowData').addEventListener('change', () => {
            this.updateStemChart();
        });

        document.getElementById('ageGroups').addEventListener('input', () => {
            this.updatePyramidChart();
        });

        document.getElementById('linkageMethod').addEventListener('change', () => {
            this.updateTreeChart();
        });

        document.getElementById('waffleRows').addEventListener('change', () => {
            this.updateWaffleChart();
        });

        document.getElementById('waffleCols').addEventListener('change', () => {
            this.updateWaffleChart();
        });
    }

    // 初始化所有图表
    initializeCharts() {
        // 添加加载状态
        this.setAllChartsLoading(true);
        
        // 使用延时确保DOM完全加载
        setTimeout(() => {
            this.createContourChart();
            setTimeout(() => {
                this.createStreamChart();
                setTimeout(() => {
                    this.createStemChart();
                    setTimeout(() => {
                        this.createDumbbellChart();
                        setTimeout(() => {
                            this.createGanttChart();
                            setTimeout(() => {
                                this.createPyramidChart();
                                setTimeout(() => {
                                    this.createFunnelChart();
                                    setTimeout(() => {
                                        this.createSankeyChart();
                                        setTimeout(() => {
                                            this.createTreeChart();
                                            setTimeout(() => {
                                                this.createWaffleChart();
                                                // 移除加载状态
                                                this.setAllChartsLoading(false);
                                                this.showNotification('所有图表已成功加载', 'success');
                                            }, 200);
                                        }, 200);
                                    }, 200);
                                }, 200);
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, 100);
    }

    // 设置所有图表的加载状态
    setAllChartsLoading(loading) {
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach(container => {
            if (loading) {
                container.classList.add('loading');
            } else {
                container.classList.remove('loading');
            }
        });
    }

    // 8.1 等高线图 - 修复版本
    createContourChart() {
        const density = parseInt(document.getElementById('contourDensity')?.value) || 256;
        const levels = parseInt(document.getElementById('contourLevels')?.value) || 8;
        
        // 使用较小的密度以提高性能和显示效果
        const actualDensity = Math.min(density, 50);
        
        // 生成数据
        const xValues = [];
        const yValues = [];
        
        for (let i = 0; i < actualDensity; i++) {
            xValues[i] = -2 + (4 * i / (actualDensity - 1));
            yValues[i] = -2 + (4 * i / (actualDensity - 1));
        }
        
        // 生成Z矩阵
        const zValues = [];
        for (let i = 0; i < actualDensity; i++) {
            zValues[i] = [];
            for (let j = 0; j < actualDensity; j++) {
                const x = xValues[j];
                const y = yValues[i];
                const h = (1 - x/2 + Math.pow(x, 5) + Math.pow(y, 3)) * Math.exp(-Math.pow(x, 2) - Math.pow(y, 2));
                zValues[i][j] = h * (this.dataRange / 100);
            }
        }

        // 使用Plotly绘制等高线图
        const data = [{
            x: xValues,
            y: yValues,
            z: zValues,
            type: 'contour',
            colorscale: [
                [0.0, '#2C3E50'],
                [0.2, '#34495E'],
                [0.4, '#7F8C8D'],
                [0.6, '#95A5A6'],
                [0.8, '#BDC3C7'],
                [1.0, '#ECF0F1']
            ],
            contours: {
                coloring: 'fill',
                showlabels: true,
                labelfont: {
                    size: 8,
                    color: '#2C3E50',
                    weight: 'bold'
                },
                start: 0,
                end: 8,
                size: 1
            },
            colorbar: {
                title: '高度值',
                titleside: 'right',
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                len: 0.8,
                thickness: 15
            },
            hovertemplate: 'X: %{x:.2f}<br>Y: %{y:.2f}<br>高度: %{z:.3f}<extra></extra>'
        }];

        const layout = {
            title: {
                text: '等高线图',
                font: { size: 16, color: '#2C3E50' }
            },
            autosize: true,
            margin: { l: 60, r: 80, t: 60, b: 60 },
            xaxis: { 
                title: 'X轴',
                showticklabels: true,
                tickfont: { size: 10, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                range: [-2, 2]
            },
            yaxis: { 
                title: 'Y轴',
                showticklabels: true,
                tickfont: { size: 10, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                range: [-2, 2]
            },
            paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.95)',
            showlegend: false,
            hoverlabel: {
                bgcolor: 'rgba(44, 62, 80, 0.9)',
                bordercolor: '#2C3E50',
                font: { color: 'white', size: 12 }
            }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'contour_chart',
                height: 600,
                width: 800,
                scale: 2
            }
        };

        Plotly.newPlot('contourChart', data, layout, config);
    }

    // 8.2 矢量场流线图 - 完整版本
    createStreamChart() {
        const density = parseInt(document.getElementById('streamDensity')?.value) || 10;
        const n = 50;
        
        // 生成网格数据
        const x = [];
        const y = [];
        for (let i = 0; i < n; i++) {
            x[i] = 0 + (5 * i / (n - 1));
            y[i] = 0 + (5 * i / (n - 1));
        }

        // 计算矢量场
        const u = [];
        const v = [];
        for (let i = 0; i < n; i++) {
            u[i] = [];
            v[i] = [];
            for (let j = 0; j < n; j++) {
                u[i][j] = x[j] * (this.dataRange / 100);
                v[i][j] = y[i] * (this.dataRange / 100);
            }
        }

        // 创建流线数据
        const streamData = [];
        const step = Math.floor(n / density);
        
        for (let i = 0; i < n; i += step) {
            for (let j = 0; j < n; j += step) {
                const startX = x[j];
                const startY = y[i];
                const startU = u[i][j];
                const startV = v[i][j];
                
                // 简化的流线追踪
                const streamlineX = [startX];
                const streamlineY = [startY];
                
                let currentX = startX;
                let currentY = startY;
                
                for (let step = 0; step < 10; step++) {
                    currentX += startU * 0.05;
                    currentY += startV * 0.05;
                    
                    if (currentX < 0 || currentX > 5 || currentY < 0 || currentY > 5) break;
                    
                    streamlineX.push(currentX);
                    streamlineY.push(currentY);
                }
                
                streamData.push({
                    x: streamlineX,
                    y: streamlineY,
                    type: 'scatter',
                    mode: 'lines',
                    line: {
                        color: `hsla(${200 + (i/n) * 60}, 70%, 50%, 0.6)`,
                        width: 2
                    }
                });
            }
        }

        // 添加矢量箭头
        for (let i = 0; i < n; i += step) {
            for (let j = 0; j < n; j += step) {
                const arrowX = x[j];
                const arrowY = y[i];
                const arrowU = u[i][j] * 0.1;
                const arrowV = v[i][j] * 0.1;
                
                streamData.push({
                    x: [arrowX, arrowX + arrowU],
                    y: [arrowY, arrowY + arrowV],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        symbol: 'triangle-right',
                        size: 6,
                        color: 'rgba(0,100,200,0.7)',
                        angle: Math.atan2(arrowV, arrowU) * 180 / Math.PI
                    }
                });
            }
        }

        const layout = {
            title: {
                text: '矢量场流线图',
                font: { size: 16 }
            },
            autosize: true,
            margin: { l: 40, r: 40, t: 40, b: 40 },
            xaxis: {
                title: 'X',
                range: [0, 5]
            },
            yaxis: {
                title: 'Y',
                range: [0, 5]
            },
            showlegend: false,
            paper_bgcolor: 'rgba(255,255,255,0)',
            plot_bgcolor: 'rgba(255,255,255,0)'
        };

        Plotly.newPlot('streamChart', streamData, layout, {
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        });
    }

    // 8.3 棉棒图 - 完整版本
    createStemChart() {
        const ctx = document.getElementById('stemChart').getContext('2d');
        const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const y = [5.9, 6.2, 6.7, 7.0, 7.0, 7.1, 7.2, 7.4, 7.5, 7.6, 7.7, 7.7, 7.7, 7.8, 7.9];
        const labels = ['宝骏310', '宝马i3', '致享', '焕驰', '力帆530', '派力奥', '悦翔V3', '乐风RV', '奥迪A1', '威驰FS', '夏利N7', '启辰R30', '和悦A13RS', '致炫', '赛欧'];
        
        const scaledY = y.map(val => val * (this.dataRange / 100));

        this.charts.stem = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '燃料消耗量(L/km)',
                    data: scaledY,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '不同品牌轿车的燃料消耗量',
                        font: { size: 14 }
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        display: document.getElementById('stemShowData')?.checked || true,
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value.toFixed(1),
                        font: {
                            weight: 'bold',
                            size: 10
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '燃料消耗量(L/km)'
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // 8.4 哑铃图 - 修复版本
    createDumbbellChart() {
        const cities = ['纽约', '洛杉矶', '芝加哥', '休斯顿', '菲尼克斯'];
        const pct2013 = [0.15, 0.12, 0.18, 0.08, 0.20];
        const pct2014 = [0.18, 0.14, 0.16, 0.11, 0.22];
        
        const scaleFactor = this.dataRange / 100;
        const scaled2013 = pct2013.map(val => val * scaleFactor);
        const scaled2014 = pct2014.map(val => val * scaleFactor);

        // 创建连接线数据
        const lineData = [];
        cities.forEach((city, i) => {
            lineData.push({
                x: [scaled2013[i], scaled2014[i]],
                y: [i, i],
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: 'rgba(135, 206, 235, 0.8)',
                    width: 4
                },
                showlegend: false,
                hoverinfo: 'none'
            });
        });

        const data = [
            ...lineData,
            {
                x: scaled2013,
                y: cities.map((_, i) => i),
                type: 'scatter',
                mode: 'markers',
                name: '2013年',
                marker: {
                    color: '#0e668b',
                    size: 14,
                    symbol: 'circle',
                    line: {
                        color: 'white',
                        width: 2
                    }
                },
                hovertemplate: '<b>2013年 - %{text}</b><br>' +
                              '变化率: %{x:.3f}<extra></extra>',
                text: cities
            },
            {
                x: scaled2014,
                y: cities.map((_, i) => i),
                type: 'scatter',
                mode: 'markers',
                name: '2014年',
                marker: {
                    color: '#a3c4dc',
                    size: 14,
                    symbol: 'circle',
                    line: {
                        color: 'white',
                        width: 2
                    }
                },
                hovertemplate: '<b>2014年 - %{text}</b><br>' +
                              '变化率: %{x:.3f}<extra></extra>',
                text: cities
            }
        ];

        const maxValue = Math.max(...scaled2014) * 1.1;

        const layout = {
            title: {
                text: '2013年与2014年美国部分城市人口PCT指标的变化率',
                font: { size: 16, color: '#2C3E50' }
            },
            autosize: true,
            margin: { l: 120, r: 80, t: 80, b: 60 },
            xaxis: {
                title: '变化率',
                range: [0, Math.max(0.25, maxValue)],
                tickvals: [0.05, 0.1, 0.15, 0.20, 0.25],
                ticktext: ['5%', '10%', '15%', '20%', '25%'],
                tickfont: { size: 11, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1
            },
            yaxis: {
                tickvals: cities.map((_, i) => i),
                ticktext: cities,
                automargin: true,
                tickfont: { size: 12, color: '#2C3E50' },
                gridcolor: 'transparent',
                linecolor: '#2C3E50',
                linewidth: 1
            },
            showlegend: true,
            legend: {
                x: 0.75,
                y: 0.95,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: '#2C3E50',
                borderwidth: 1,
                font: { size: 12, color: '#2C3E50' }
            },
            paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.95)',
            hoverlabel: {
                bgcolor: 'rgba(44, 62, 80, 0.9)',
                bordercolor: '#2C3E50',
                font: { color: 'white', size: 12 }
            }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'dumbbell_chart',
                height: 600,
                width: 800,
                scale: 2
            }
        };

        Plotly.newPlot('dumbbellChart', data, layout, config);
    }

    // 8.5 甘特图 - 修复版本
    createGanttChart() {
        const tasks = ['项目确定', '问卷设计', '试访', '问卷确定', '实地执行', '数据录入', '数据分析', '报告提交'];
        const durations = [2, 1, 1, 0.5, 3, 1, 1.5, 0.5];
        const starts = [0, 1.5, 2, 3, 3.5, 6.5, 7.5, 9];
        
        const scaleFactor = this.dataRange / 100;
        const scaledDurations = durations.map(val => val * scaleFactor);
        const scaledStarts = starts.map(val => val * scaleFactor);

        // 为每个任务创建单独的数据点
        const data = [{
            x: scaledStarts,
            y: tasks,
            orientation: 'h',
            type: 'bar',
            marker: {
                color: '#CD5C5C',
                line: {
                    color: '#8B0000',
                    width: 2
                }
            },
            width: scaledDurations,
            hovertemplate: '<b>%{y}</b><br>' +
                          '开始: %{x:.1f}天<br>' +
                          '时长: %{width:.1f}天<br>' +
                          '结束: %{customdata:.1f}天<extra></extra>',
            customdata: scaledStarts.map((start, i) => start + scaledDurations[i])
        }];

        const maxEnd = Math.max(...scaledStarts.map((start, i) => start + scaledDurations[i]));

        const layout = {
            title: {
                text: '任务甘特图',
                font: { size: 16, color: '#2C3E50' }
            },
            autosize: true,
            margin: { l: 120, r: 80, t: 80, b: 60 },
            xaxis: {
                title: '项目进度（天）',
                range: [0, Math.max(12, maxEnd * 1.1)],
                tickfont: { size: 11, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                showgrid: true
            },
            yaxis: {
                automargin: true,
                tickfont: { size: 12, color: '#2C3E50' },
                gridcolor: 'transparent',
                linecolor: '#2C3E50',
                linewidth: 1
            },
            showlegend: false,
            paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.95)',
            hoverlabel: {
                bgcolor: 'rgba(205, 92, 92, 0.9)',
                bordercolor: '#8B0000',
                font: { color: 'white', size: 12 }
            }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'gantt_chart',
                height: 600,
                width: 800,
                scale: 2
            }
        };

        Plotly.newPlot('ganttChart', data, layout, config);
    }

    // 8.6 人口金字塔 - 修复版本
    createPyramidChart() {
        const ageGroups = 10;
        const labels = ['0-9岁', '10-19岁', '20-29岁', '30-39岁', '40-49岁', '50-59岁', '60-69岁', '70-79岁', '80-89岁', '90岁以上'];
        const male = [50000, 45000, 60000, 70000, 65000, 55000, 40000, 25000, 10000, 2000];
        const female = [48000, 43000, 58000, 68000, 63000, 53000, 42000, 28000, 12000, 3000];
        
        const scaleFactor = this.dataRange / 100;
        const scaledMale = male.map(val => val * scaleFactor);
        const scaledFemale = female.map(val => val * scaleFactor);

        const maxPopulation = 100000 * scaleFactor;

        const data = [
            {
                y: labels,
                x: scaledMale.map(val => -val),
                name: '男性',
                orientation: 'h',
                type: 'bar',
                marker: {
                    color: '#6699FF',
                    line: {
                        color: '#4477CC',
                        width: 1
                    }
                },
                hovertemplate: '<b>男性</b><br>' +
                              '年龄段: %{y}<br>' +
                              '人数: %{customdata:,}人<extra></extra>',
                customdata: scaledMale.map(val => Math.abs(val))
            },
            {
                y: labels,
                x: scaledFemale,
                name: '女性',
                orientation: 'h',
                type: 'bar',
                marker: {
                    color: '#CC6699',
                    line: {
                        color: '#AA4477',
                        width: 1
                    }
                },
                hovertemplate: '<b>女性</b><br>' +
                              '年龄段: %{y}<br>' +
                              '人数: %{x:,}人<extra></extra>',
                customdata: scaledFemale
            }
        ];

        const layout = {
            title: {
                text: '某城市人口金字塔',
                font: { size: 16, color: '#2C3E50' }
            },
            autosize: true,
            margin: { l: 80, r: 80, t: 80, b: 60 },
            barmode: 'overlay',
            bargap: 0.1,
            xaxis: {
                title: '人数（个）',
                range: [-maxPopulation, maxPopulation],
                tickvals: [-100000, -75000, -50000, -25000, 0, 25000, 50000, 75000, 100000].map(val => val * scaleFactor),
                ticktext: ['100000', '75000', '50000', '25000', '0', '25000', '50000', '75000', '100000'],
                tickfont: { size: 11, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                zeroline: true,
                zerolinecolor: '#2C3E50',
                zerolinewidth: 2
            },
            yaxis: {
                title: '年龄段',
                tickfont: { size: 12, color: '#2C3E50' },
                gridcolor: 'transparent',
                linecolor: '#2C3E50',
                linewidth: 1,
                automargin: true
            },
            showlegend: true,
            legend: {
                x: 0.5,
                y: 0.95,
                orientation: 'h',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: '#2C3E50',
                borderwidth: 1,
                font: { size: 12, color: '#2C3E50' },
                tracegroupgap: 0
            },
            paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.95)',
            hoverlabel: {
                bgcolor: 'rgba(44, 62, 80, 0.9)',
                bordercolor: '#2C3E50',
                font: { color: 'white', size: 12 }
            }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'population_pyramid',
                height: 600,
                width: 800,
                scale: 2
            }
        };

        Plotly.newPlot('pyramidChart', data, layout, config);
    }

    // 8.7 漏斗图 - 修复版本
    createFunnelChart() {
        const stages = ['访问商品', '加购物车', '生成订单', '支付订单', '完成交易'];
        const values = [1000, 500, 300, 200, 150];
        
        const scaleFactor = this.dataRange / 100;
        const scaledValues = values.map(val => val * scaleFactor);
        const maxValue = Math.max(...scaledValues);

        // 使用条形图创建漏斗效果
        const data = [{
            x: scaledValues,
            y: stages,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: scaledValues.map((val, i) => {
                    const hue = 200 + (i * 20);
                    const lightness = 50 + (i * 8);
                    return `hsla(${hue}, 70%, ${lightness}%, 0.8)`;
                }),
                line: {
                    color: '#2C3E50',
                    width: 2
                }
            },
            text: scaledValues.map((val, i) => {
                const percentage = ((val / scaledValues[0]) * 100).toFixed(1);
                return `${val}人 (${percentage}%)`;
            }),
            textposition: 'inside',
            textfont: {
                color: 'white',
                size: 12,
                weight: 'bold'
            },
            hovertemplate: '<b>%{y}</b><br>' +
                          '人数: %{x:,}人<br>' +
                          '占比: %{text}<extra></extra>'
        }];

        const layout = {
            title: {
                text: '客户转化漏斗',
                font: { size: 16, color: '#2C3E50' }
            },
            autosize: true,
            margin: { l: 120, r: 80, t: 80, b: 60 },
            xaxis: {
                title: '客户数量',
                range: [0, maxValue * 1.1],
                tickfont: { size: 11, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                tickformat: ','
            },
            yaxis: {
                tickfont: { size: 12, color: '#2C3E50' },
                gridcolor: 'transparent',
                linecolor: '#2C3E50',
                linewidth: 1,
                automargin: true
            },
            showlegend: false,
            paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.95)',
            hoverlabel: {
                bgcolor: 'rgba(44, 62, 80, 0.9)',
                bordercolor: '#2C3E50',
                font: { color: 'white', size: 12 }
            }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'funnel_chart',
                height: 600,
                width: 800,
                scale: 2
            }
        };

        Plotly.newPlot('funnelChart', data, layout, config);
    }

    // 8.8 桑基图 - 完整版本
    createSankeyChart() {
        const scaleFactor = this.dataRange / 100;
        
        const data = {
            type: "sankey",
            orientation: "h",
            node: {
                pad: 15,
                thickness: 20,
                line: {
                    color: "black",
                    width: 0.5
                },
                label: ["工资", "副业", "生活", "购物", "深造", "运动", "其他", "买书"]
            },
            link: {
                source: [0, 0, 1, 1, 2, 3, 4, 5],
                target: [2, 3, 2, 4, 5, 6, 7, 6],
                value: [0.3, 0.1, 0.3, 0.3, 0.1, 0.1, 0.1, 0.1].map(val => val * scaleFactor)
            }
        };

        const layout = {
            title: {
                text: "日常生活开支的桑基图",
                font: { size: 14 }
            },
            autosize: true,
            margin: { l: 40, r: 40, t: 60, b: 40 },
            font: {
                size: 10
            },
            paper_bgcolor: 'rgba(255,255,255,0)',
            plot_bgcolor: 'rgba(255,255,255,0)'
        };

        Plotly.newPlot('sankeyChart', [data], layout, {
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        });
    }

    // 8.9 树状图 - 完整版本
    createTreeChart() {
        // 生成示例数据
        const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
                      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa'];
        const murder = [13.2, 10.0, 7.8, 8.8, 9.0, 7.9, 3.3, 5.9, 15.4, 17.4, 5.3, 2.6, 10.4, 7.2, 2.2];
        const assault = [236, 263, 294, 190, 276, 204, 110, 238, 335, 211, 46, 120, 262, 157, 89];
        const urbanPop = [58, 48, 80, 50, 91, 78, 77, 72, 80, 60, 84, 57, 83, 72, 47];
        
        const scaleFactor = this.dataRange / 100;
        const scaledMurder = murder.map(val => val * scaleFactor);
        const scaledAssault = assault.map(val => val * scaleFactor);
        const scaledUrbanPop = urbanPop.map(val => val * scaleFactor);

        // 使用散点图实现聚类可视化
        const scatterData = [{
            x: scaledMurder,
            y: scaledAssault,
            mode: 'markers+text',
            type: 'scatter',
            marker: {
                size: 12,
                color: scaledUrbanPop,
                colorscale: this.getColorScheme(),
                showscale: true,
                colorbar: {
                    title: '城市人口比例',
                    titleside: 'right'
                }
            },
            text: states,
            textposition: 'top center',
            textfont: {
                size: 8
            },
            hovertemplate: '<b>%{text}</b><br>' +
                          '谋杀率: %{x:.1f}<br>' +
                          '袭击率: %{y:.1f}<br>' +
                          '城市人口: %{marker.color:.1f}%<extra></extra>'
        }];

        const layout = {
            title: {
                text: '美国各州犯罪案件聚类分析',
                font: { size: 14 }
            },
            autosize: true,
            margin: { l: 50, r: 80, t: 60, b: 40 },
            xaxis: {
                title: '谋杀率',
                gridcolor: '#e0e0e0'
            },
            yaxis: {
                title: '袭击率',
                gridcolor: '#e0e0e0'
            },
            plot_bgcolor: 'rgba(255,255,255,0)',
            paper_bgcolor: 'rgba(255,255,255,0)'
        };

        Plotly.newPlot('treeChart', scatterData, layout, {
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        });
    }

    // 8.10 华夫饼图 - 修复版本
    createWaffleChart() {
        const rows = parseInt(document.getElementById('waffleRows')?.value) || 10;
        const cols = parseInt(document.getElementById('waffleCols')?.value) || 10;
        const totalCells = rows * cols;
        
        const targetOccupied = Math.floor(95 * (this.dataRange / 100));
        const occupied = Math.min(targetOccupied, totalCells);
        const empty = totalCells - occupied;

        // 创建网格数据
        const data = [];
        let occupiedCount = 0;

        // 创建有序的填充模式，从左上角开始
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isOccupied = occupiedCount < occupied;
                
                data.push({
                    x: col,
                    y: rows - row - 1,  // 反转Y轴使底部为第0行
                    value: isOccupied ? 1 : 0,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        color: isOccupied ? '#20B2AA' : '#D3D3D3',
                        size: 20,
                        symbol: 'square',
                        line: {
                            color: 'white',
                            width: 2
                        },
                        opacity: isOccupied ? 0.9 : 0.6
                    },
                    hoverinfo: 'text',
                    text: isOccupied ? '占座' : '空座',
                    showlegend: false
                });

                if (isOccupied) {
                    occupiedCount++;
                }
            }
        }

        const layout = {
            title: {
                text: `电影《少年的你》上座率`,
                font: { size: 16, color: '#2C3E50' }
            },
            autosize: true,
            margin: { l: 60, r: 60, t: 80, b: 80 },
            xaxis: {
                title: '列',
                range: [-0.5, cols - 0.5],
                tickvals: Array.from({length: cols}, (_, i) => i),
                tickfont: { size: 10, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                scaleanchor: 'y',
                scaleratio: 1
            },
            yaxis: {
                title: '行',
                range: [-0.5, rows - 0.5],
                tickvals: Array.from({length: rows}, (_, i) => i),
                tickfont: { size: 10, color: '#2C3E50' },
                gridcolor: '#E0E0E0',
                linecolor: '#2C3E50',
                linewidth: 1,
                autorange: 'reversed'
            },
            showlegend: true,
            legend: {
                x: 0.98,
                y: 0.02,
                xanchor: 'right',
                yanchor: 'bottom',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                bordercolor: '#2C3E50',
                borderwidth: 1,
                font: { size: 12, color: '#2C3E50' },
                itemsizing: 'constant',
                tracegroupgap: 5
            },
            paper_bgcolor: 'rgba(248, 249, 250, 0.9)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.95)',
            hoverlabel: {
                bgcolor: 'rgba(32, 178, 170, 0.9)',
                bordercolor: '#20B2AA',
                font: { color: 'white', size: 12 }
            },
            annotations: [
                {
                    x: cols / 2,
                    y: -0.8,
                    text: `上座率: ${((occupied / totalCells) * 100).toFixed(1)}%`,
                    showarrow: false,
                    font: {
                        size: 14,
                        color: '#2C3E50',
                        weight: 'bold'
                    },
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    bordercolor: '#20B2AA',
                    borderwidth: 2,
                    borderpad: 8
                }
            ]
        };

        // 添加图例数据
        const legendData = [
            {
                x: [null],
                y: [null],
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: '#20B2AA',
                    size: 20,
                    symbol: 'square',
                    line: {
                        color: 'white',
                        width: 2
                    },
                    opacity: 0.9
                },
                name: `占座 (${occupied}个)`,
                showlegend: true
            },
            {
                x: [null],
                y: [null],
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: '#D3D3D3',
                    size: 20,
                    symbol: 'square',
                    line: {
                        color: 'white',
                        width: 2
                    },
                    opacity: 0.6
                },
                name: `空座 (${empty}个)`,
                showlegend: true
            }
        ];

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
            toImageButtonOptions: {
                format: 'png',
                filename: 'waffle_chart',
                height: 600,
                width: 800,
                scale: 2
            }
        };

        Plotly.newPlot('waffleChart', [...data, ...legendData], layout, config);
    }

    // 更新所有图表
    updateAllCharts() {
        this.updateContourChart();
        this.updateStreamChart();
        this.updateStemChart();
        this.updateDumbbellChart();
        this.updateGanttChart();
        this.updatePyramidChart();
        this.updateFunnelChart();
        this.updateSankeyChart();
        this.updateTreeChart();
        this.updateWaffleChart();
    }

    // 各个图表的更新方法
    updateContourChart() {
        this.createContourChart();
    }

    updateStreamChart() {
        this.createStreamChart();
    }

    updateStemChart() {
        this.createStemChart();
    }

    updateDumbbellChart() {
        this.createDumbbellChart();
    }

    updateGanttChart() {
        this.createGanttChart();
    }

    updatePyramidChart() {
        this.createPyramidChart();
    }

    updateFunnelChart() {
        this.createFunnelChart();
    }

    updateSankeyChart() {
        this.createSankeyChart();
    }

    updateTreeChart() {
        this.createTreeChart();
    }

    updateWaffleChart() {
        this.createWaffleChart();
    }

    // 筛选图表
    filterCharts(chartType) {
        const containers = document.querySelectorAll('.chart-container');
        
        containers.forEach(container => {
            if (chartType === 'all') {
                container.classList.remove('hidden');
            } else {
                const containerType = container.getAttribute('data-chart');
                if (containerType === chartType) {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            }
        });
        
        this.currentChartType = chartType;
    }

    // 刷新所有数据
    refreshAllData() {
        // 添加随机变化来模拟数据刷新
        this.dataRange = 80 + Math.random() * 20;
        document.getElementById('dataRange').value = this.dataRange;
        document.getElementById('dataRangeValue').textContent = `${Math.round(this.dataRange)}%`;
        this.updateAllCharts();
        this.showNotification('数据已刷新', 'success');
    }

    // 导出图表
    exportCharts() {
        const charts = ['contourChart', 'streamChart', 'stemChart', 'dumbbellChart', 'ganttChart', 
                       'pyramidChart', 'funnelChart', 'sankeyChart', 'treeChart', 'waffleChart'];
        
        charts.forEach(chartId => {
            const element = document.getElementById(chartId);
            if (element) {
                // 为canvas图表使用Chart.js的导出功能
                if (element.tagName === 'CANVAS') {
                    const chart = this.charts[chartId.replace('Chart', '')];
                    if (chart) {
                        const url = chart.toBase64Image();
                        const link = document.createElement('a');
                        link.download = `${chartId}.png`;
                        link.href = url;
                        link.click();
                    }
                } else {
                    // 为Plotly图表使用导出功能
                    Plotly.downloadImage(element, {
                        format: 'png',
                        width: 800,
                        height: 600,
                        filename: chartId
                    });
                }
            }
        });
        this.showNotification('图表已导出', 'success');
    }

    // 打开自定义数据模态框
    openCustomDataModal(chartType) {
        const modal = document.getElementById('dataModal');
        const modalBody = document.getElementById('modalBody');
        
        let modalContent = '';
        
        switch(chartType) {
            case 'stem':
                modalContent = `
                    <h3>自定义棉棒图数据</h3>
                    <p>请输入JSON格式的数据，格式为: {"labels": ["标签1", "标签2"], "values": [值1, 值2]}</p>
                    <textarea id="customData" placeholder='{"labels": ["A", "B", "C"], "values": [1, 2, 3]}'></textarea>
                `;
                break;
            case 'dumbbell':
                modalContent = `
                    <h3>自定义哑铃图数据</h3>
                    <p>请输入JSON格式的数据，格式为: {"labels": ["城市1", "城市2"], "values2013": [值1, 值2], "values2014": [值1, 值2]}</p>
                    <textarea id="customData" placeholder='{"labels": ["A", "B"], "values2013": [0.1, 0.2], "values2014": [0.15, 0.25]}'></textarea>
                `;
                break;
            case 'gantt':
                modalContent = `
                    <h3>自定义甘特图数据</h3>
                    <p>请输入JSON格式的数据，格式为: {"tasks": ["任务1", "任务2"], "durations": [时长1, 时长2], "starts": [开始1, 开始2]}</p>
                    <textarea id="customData" placeholder='{"tasks": ["任务1", "任务2"], "durations": [1, 2], "starts": [0, 1]}'></textarea>
                `;
                break;
            default:
                modalContent = `
                    <h3>自定义数据</h3>
                    <p>请输入JSON格式的数据</p>
                    <textarea id="customData" placeholder='{"key": "value"}'></textarea>
                `;
        }
        
        modalBody.innerHTML = modalContent;
        modal.style.display = 'block';
        
        // 保存按钮事件
        document.getElementById('saveData').onclick = () => {
            try {
                const customData = JSON.parse(document.getElementById('customData').value);
                this.applyCustomData(chartType, customData);
                modal.style.display = 'none';
                this.showNotification('数据已应用', 'success');
            } catch (error) {
                this.showNotification('数据格式错误，请输入有效的JSON格式数据', 'error');
            }
        };
    }

    // 应用自定义数据
    applyCustomData(chartType, customData) {
        switch(chartType) {
            case 'stem':
                if (customData.labels && customData.values) {
                    this.charts.stem.data.labels = customData.labels;
                    this.charts.stem.data.datasets[0].data = customData.values;
                    this.charts.stem.update();
                }
                break;
            case 'dumbbell':
                if (customData.labels && customData.values2013 && customData.values2014) {
                    this.createDumbbellChart(); // 重新创建图表
                }
                break;
            case 'gantt':
                if (customData.tasks && customData.durations && customData.starts) {
                    this.createGanttChart(); // 重新创建图表
                }
                break;
            // 其他图表类型可以继续添加
        }
    }

    // 新增功能方法

    // 获取颜色方案
    getColorScheme() {
        const schemes = {
            'default': 'Copper',
            'pastel': 'Pastel',
            'vibrant': 'Viridis',
            'monochrome': 'Greys',
            'rainbow': 'Rainbow'
        };
        return schemes[this.currentTheme] || 'Copper';
    }

    // 切换图表类型
    changeChartType(type) {
        if (type === 'current') return;
        
        // 这里可以根据选择的图表类型重新渲染当前显示的图表
        console.log('切换图表类型到:', type);
        // 实现具体的图表类型转换逻辑
    }

    // 更新主题颜色
    updateThemeColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        // 更新所有图表的主题色
        this.updateAllCharts();
    }

    // 更新字体大小
    updateFontSize(size) {
        document.documentElement.style.setProperty('--base-font-size', size + 'px');
        // 更新所有图表的字体
        this.updateAllCharts();
    }

    // 切换拖放模式
    toggleDragDropMode() {
        this.dragDropMode = !this.dragDropMode;
        const dragArea = document.getElementById('dragDropArea');
        const button = document.getElementById('toggleDragMode');
        
        if (this.dragDropMode) {
            dragArea.classList.remove('hidden');
            button.textContent = '关闭拖放';
            button.classList.add('active');
        } else {
            dragArea.classList.add('hidden');
            button.textContent = '拖放模式';
            button.classList.remove('active');
        }
    }

    // 关闭拖放区域
    closeDragDropArea() {
        this.dragDropMode = false;
        document.getElementById('dragDropArea').classList.add('hidden');
        document.getElementById('toggleDragMode').textContent = '拖放模式';
    }

    // 处理文件选择
    handleFileSelect(files) {
        if (files.length === 0) return;
        
        const previewContent = document.getElementById('previewContent');
        let previewHTML = '<table border="1" style="width:100%; border-collapse: collapse;">';
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const content = e.target.result;
                
                if (file.name.endsWith('.json')) {
                    try {
                        const jsonData = JSON.parse(content);
                        this.processJSONData(jsonData, file.name);
                        previewHTML += `<tr><td colspan="2"><strong>${file.name}</strong></td></tr>`;
                        previewHTML += `<tr><td>类型</td><td>JSON</td></tr>`;
                        previewHTML += `<tr><td>数据条目</td><td>${Object.keys(jsonData).length}</td></tr>`;
                    } catch (error) {
                        previewHTML += `<tr><td colspan="2">JSON解析错误: ${file.name}</td></tr>`;
                    }
                } else if (file.name.endsWith('.csv')) {
                    this.processCSVData(content, file.name);
                    const lines = content.split('\n').filter(line => line.trim());
                    previewHTML += `<tr><td colspan="2"><strong>${file.name}</strong></td></tr>`;
                    previewHTML += `<tr><td>类型</td><td>CSV</td></tr>`;
                    previewHTML += `<tr><td>行数</td><td>${lines.length}</td></tr>`;
                    previewHTML += `<tr><td>列数</td><td>${lines[0]?.split(',').length || 0}</td></tr>`;
                }
                
                previewContent.innerHTML = previewHTML + '</table>';
                previewContent.classList.add('slide-in');
            };
            
            if (file.name.endsWith('.json')) {
                reader.readAsText(file);
            } else if (file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                previewHTML += `<tr><td colspan="2">不支持的文件类型: ${file.name}</td></tr>`;
            }
        });
    }

    // 处理JSON数据
    processJSONData(jsonData, fileName) {
        console.log('处理JSON数据:', jsonData, fileName);
        // 根据数据结构自动识别并更新对应的图表
        this.applyDataToCharts(jsonData);
    }

    // 处理CSV数据
    processCSVData(csvContent, fileName) {
        console.log('处理CSV数据:', fileName);
        // 解析CSV并转换为图表数据
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = isNaN(values[index]) ? values[index] : parseFloat(values[index]);
                });
                data.push(row);
            }
        }
        
        this.applyDataToCharts(data);
    }

    // 应用数据到图表
    applyDataToCharts(data) {
        // 智能识别数据类型并应用到合适的图表
        if (Array.isArray(data) && data.length > 0) {
            const firstRow = data[0];
            const keys = Object.keys(firstRow);
            
            // 如果有两个数值列，可能适合散点图或线图
            if (keys.length >= 2) {
                const numericKeys = keys.filter(key => 
                    typeof firstRow[key] === 'number' || !isNaN(firstRow[key])
                );
                
                if (numericKeys.length >= 2) {
                    this.updateChartWithData('scatter', numericKeys[0], numericKeys[1], data);
                }
            }
        }
    }

    // 更新图表数据
    updateChartWithData(chartType, xKey, yKey, data) {
        const xValues = data.map(item => item[xKey]);
        const yValues = data.map(item => item[yKey]);
        
        // 这里可以根据需要更新不同的图表
        console.log('更新图表:', chartType, xKey, yKey);
    }

    // 应用自定义样式
    applyCustomStyles() {
        const styles = {
            themeColor: document.getElementById('customThemeColor').value,
            bgColor: document.getElementById('customBgColor').value,
            textColor: document.getElementById('customTextColor').value,
            colorScheme: document.getElementById('colorScheme').value,
            fontFamily: document.getElementById('fontFamily').value,
            titleSize: document.getElementById('titleSize').value,
            bodySize: document.getElementById('bodySize').value,
            fontWeight: document.getElementById('fontWeight').value,
            chartSpacing: document.getElementById('chartSpacing').value,
            borderRadius: document.getElementById('borderRadius').value,
            shadowEffect: document.getElementById('shadowEffect').checked,
            animationEffect: document.getElementById('animationEffect').checked
        };

        // 应用样式
        document.body.style.fontFamily = styles.fontFamily;
        document.body.style.color = styles.textColor;
        document.body.style.fontSize = styles.bodySize + 'px';
        
        // 更新图表间距
        const chartsGrid = document.querySelector('.charts-grid');
        if (chartsGrid) {
            chartsGrid.style.gap = styles.chartSpacing + 'px';
        }
        
        // 更新圆角
        document.querySelectorAll('.chart-container, .controls').forEach(el => {
            el.style.borderRadius = styles.borderRadius + 'px';
        });
        
        // 保存样式设置
        this.customStyles = styles;
        this.currentTheme = styles.colorScheme;
        
        // 重新渲染所有图表
        this.updateAllCharts();
        
        // 关闭模态框
        document.getElementById('styleModal').style.display = 'none';
        
        // 显示成功提示
        this.showNotification('样式已应用', 'success');
    }

    // 重置样式
    resetStyles() {
        // 重置为默认样式
        document.body.style.fontFamily = '';
        document.body.style.color = '';
        document.body.style.fontSize = '';
        
        this.customStyles = {};
        this.currentTheme = 'default';
        
        this.updateAllCharts();
        document.getElementById('styleModal').style.display = 'none';
        this.showNotification('样式已重置', 'info');
    }

    // 保存样式预设
    saveStylePreset() {
        if (Object.keys(this.customStyles).length === 0) {
            this.showNotification('请先应用样式设置', 'warning');
            return;
        }
        
        // 保存到localStorage
        localStorage.setItem('chartStylePreset', JSON.stringify(this.customStyles));
        this.showNotification('样式预设已保存', 'success');
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        const colors = {
            success: 'linear-gradient(45deg, #28a745, #20c997)',
            error: 'linear-gradient(45deg, #dc3545, #c82333)',
            warning: 'linear-gradient(45deg, #ffc107, #ff9800)',
            info: 'linear-gradient(45deg, #17a2b8, #007bff)'
        };
        
        notification.style.background = colors[type] || colors.info;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 初始化仪表板
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DataVisualizationDashboard();
});