var chartObj;  // Declarar fuera de FusionCharts.ready
document.addEventListener('DOMContentLoaded', function() {
    window.tankSim = chartObj
    window.addEventListener("message", function(event) {
        if (event.data.type === "IMGanimation") {
            let currentData = chartObj.getJSONData();
            let items = currentData.annotations.groups.find(g => g.id === "imageGroup").items;
            items.forEach(item => {
                if (item.id === "img1") item.visible = "1";
                if (item.id === "img2") item.visible = "0";
                if (item.id === "img3") item.visible = "1";
                if (item.id === "img4") item.visible = "0";
            });
            chartObj.setJSONData(currentData);
        }
      });
    
    // Verificar si el contenedor existe
    if (document.getElementById('chart-container')) {
        FusionCharts.ready(function() {
            // Verificar si ya existe una instancia y destruirla
            if (FusionCharts('chartId')) {
                FusionCharts('chartId').dispose();
            }
            
            chartObj = new FusionCharts({
                type: 'cylinder',
                dataFormat: 'json',
                renderAt: 'chart-container',
                width: '350',
                height: '400', // Aumentado aún más para dar espacio al cilindro desplazado
                dataSource: {
                    "chart": {
                        "theme": "fusion",
                        "caption": "",
                        "subcaption": "",
                        "lowerLimit": "0",
                        "upperLimit": "800",
                        "lowerLimitDisplay": "Empty",
                        "upperLimitDisplay": "Full",
                        "numberSuffix": " ltrs",
                        "showValue": "0",
                        //"dataStreamUrl": "read_data2.php",
                        "refreshInterval": "0.1",
                        //"refreshInstantly": "0.1",
                        "chartTopMargin": '120', // Aumentado aún más
                        "chartBottomMargin": '50',
                        "chartLeftMargin": '50',
                        "chartRightMargin": '50',
                        "cylFillColor": "#35d1fd",
                        "cyloriginx": "125",
                        "cyloriginy": "320", // Aumentado para mover el cilindro hacia abajo
                        "cylradius": "120",
                        "cylheight": "250",
                        "showAnnotations": "1", // Asegura que se muestren las anotaciones
                        "drawCustomLegendIcon": "0",
                        //"annotationPosition": "front" // No importa o esta sobrescrita
                    },
                    "value": "200",
                    annotations: {
                        origw: "350",
                        origh: "500", // Actualizado para coincidir con el nuevo alto
                        autoscale: "1",
                        showBelow: "1", // Las anotaciones no están limitadas por el borde superior
                        constrainedScale: "0", // Permite que las anotaciones excedan los límites del gráfico
                        groups: [
                            {
                                id: "imageGroup",
                                items: [
                                    {
                                        name: "img1",
                                        id: "img1",
                                        type: "image",
                                        url: "canillaON.png",
                                        x: "0",
                                        y: "0", 
                                        xScale: "55",
                                        yScale: "60",
                                        zIndex: "5", // Valor bajo para colocarlo debajo de otros elementos
                                        allowOverflow: "1", // Permite que la imagen se desborde
                                        visible: "0" // 0 para ocultar, 1 para mostrar inicialmente
                                    },
                                    {
                                        name: "img2",
                                        id: "img2",
                                        type: "image",
                                        url: "canillaOFF.png",
                                        x: "0",
                                        y: "0",
                                        xScale: "55",
                                        yScale: "60",
                                        zIndex: "5",
                                        allowOverflow: "1",
                                        visible: "1" // 0 para ocultar, 1 para mostrar inicialmente
                                    },
                                    {
                                        id: "img3",
                                        type: "image",
                                        url: "salidaON.png",
                                        x: "245",
                                        y: "360",
                                        xScale: "20",
                                        yScale: "20",
                                        zIndex: "5",
                                        allowOverflow: "1",
                                        visible: "0" // 0 para ocultar, 1 para mostrar inicialmente
                                    },
                                    {
                                        id: "img4",
                                        type: "image",
                                        url: "salidaOFF.png",
                                        x: "245",
                                        y: "360",
                                        xScale: "20",
                                        yScale: "20",
                                        zIndex: "5",
                                        allowOverflow: "1",
                                        visible: "1" // 0 para ocultar, 1 para mostrar inicialmente
                                    },
                                    {
                                        id: "horizontalLine",
                                        type: "line",
                                        x: "50",           // desde la izquierda del gráfico
                                        y: "314.21",        // Y calculado previamente
                                        toX: "300",        // hasta la derecha del gráfico
                                        toY: "314.21",      // misma Y para que sea horizontal
                                        color: "#ff0000",  // color rojo
                                        thickness: "2",
                                        alpha: "100",
                                        dashed: "1",
                                        dashLen: "4",
                                        dashGap: "2",
                                        showBelow: "0"
                                    }
                                ]
                            }
                        ]
                    }
                }
            });
            


            // Solo intentar renderizar si el contenedor existe
            if (document.getElementById('chart-container')) {
                chartObj.render();
            } else {
                console.error("El contenedor 'chart-container' no existe en el DOM");
            }
        });
    } else {
        console.error("El contenedor 'chart-container' no existe en el DOM al cargar la página");
    }
});
