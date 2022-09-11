import {
    pointName,
    pointCoordinate
} from "./point.js";
import {
    pointCoordinate as allpoint
} from "./allpoint.js";
import {
    path,
    startOptionsValue,
    endOptionsValue
} from "./dijkstra.js";


//创建地图实例
const map = new BMap.Map("mapContainer");
var point = new BMap.Point(116.64147602899914, 23.418495107908164); //设置中心点坐标
map.centerAndZoom(point, 17); //地图初始化，同时设置地图展示级别
map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
map.setMapStyleV2({
    styleId: 'af09776652e1308ed209179eda981505'
});


const myModal = new bootstrap.Modal(document.getElementById("myModal")); //创建modal实例
const myModalEl = document.getElementById('myModal');
var notAllow = document.getElementById("notAllow");
var allow = document.getElementById("allow");
var start = document.getElementById("start-select");
var end = document.getElementById("end-select");
var currentPoint = new BMap.Point();
var isSuccess = false;
myModalEl.addEventListener('show.bs.modal', () => { //是否允许获取当前位置
    notAllow.addEventListener('click', () => {
        setOptions(start, pointName);
        setOptions(end, pointName);
        myModal.hide();
        setMarker(pointName, pointCoordinate);

    })
    allow.addEventListener('click', () => {
        var currentInfo = getCurrent();
        currentPoint = currentInfo.currentPoint;
        isSuccess = currentInfo.isSuccess;
        if (isSuccess) {
            setOptions(start, pointName, currentPoint);
        } else {
            setOptions(start, pointName);
        }
        setOptions(end, pointName);
        myModal.hide();
        setMarker(pointName, pointCoordinate);

    })

});
myModal.show();




//步行路线规划
var startPoint = new BMap.Point();
var endPoint = new BMap.Point();
var confirm = document.getElementById("confirm");
var walk = new BMap.WalkingRoute(map, {
    renderOptions: {
        autoViewport: true
    }
});
// confirm.addEventListener('click', () => {
//     walk.clearResults(); //清除最近一次检索的结果
//     if (startOptionsValue == -1) {
//         walk.search(pointCoordinate[startOptionsValue][0], pointCoordinate[endOptionsValue][1]);
//     } else {
//         for (let i = 0; i < path.length - 1; i++) {
//             startPoint.lng = allpoint[path[i]][0];
//             startPoint.lat = allpoint[path[i]][1];
//             endPoint.lng = allpoint[path[i + 1]][0];
//             endPoint.lat = allpoint[path[i + 1]][1];
//             console.log(path[i]);
//             walk.search(startPoint, endPoint);
//             var polyline = new BMap.Polyline([startPoint, endPoint], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});
//             map.addOverlay(polyline);
//         }
//     }
// })
var chartData = [];
var polyline;
confirm.addEventListener('click', () => {
    map.removeOverlay(polyline);
    walk.clearResults();
    if (startOptionsValue == -1) {
        walk.search(pointCoordinate[startOptionsValue][0], pointCoordinate[endOptionsValue][1]);
    } else {
        planPath(path.length - 1);
        setTimeout(() => {
            polyline = new BMap.Polyline(chartData, {
                strokeColor: "blue",
                strokeWeight: 6,
                strokeOpacity: 0.5
            });
            map.addOverlay(polyline);
            chartData = [];
        }, 1000);
        
    }
})

function planPath(i) {
    if (i < 1) return;
    startPoint.lng = allpoint[path[i]][0];
    startPoint.lat = allpoint[path[i]][1];
    endPoint.lng = allpoint[path[i - 1]][0];
    endPoint.lat = allpoint[path[i - 1]][1];
    walk.search(startPoint, endPoint);
    walk.setSearchCompleteCallback((rs) => {
        var result = walk.getResults().getPlan(0).getRoute(0).getPath();
        for (let i = 0; i < result.length; i++) {
            chartData.push(new BMap.Point(result[i].lng, result[i].lat));
        }
        planPath(i - 1);
    })
    return;
}


//添加标注
function setMarker(pointName, pointCoordinate) {
    for (let i = 0; i < pointName.length; i++) {
        point = new BMap.Point(pointCoordinate[i][0], pointCoordinate[i][1]);
        var marker = new BMap.Marker(point);
        var label = new BMap.Label(pointName[i]);
        marker.setLabel(label);
        map.addOverlay(marker);
    }
}

//添加起点、终点选项
function setOptions(element, pointName, currentPoint) {
    var option;
    if (currentPoint) {
        option = new Option('当前位置', -1);
        element.options.add(option);
    }
    for (let i = 0; i < pointName.length; i++) {
        option = new Option(pointName[i], i);
        element.options.add(option);
    }
}

//获取当前坐标，将获取的WGS84坐标转换为百度的bd09坐标
function getCurrent() {
    var currentPoint = new BMap.Point();
    var currentInfo = {
        currentPoint: currentPoint,
        isSuccess: false
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            currentInfo.isSuccess = true;
            console.log(pos);
            var point = new BMap.Point(pos.coords.longitude, pos.coords.latitude);
            var mk = new BMap.Marker(point);
            map.addOverlay(mk);
            map.panTo(point);
            currentPoint.lng = point.lng;
            currentPoint.lat = point.lat;
            var myAlert = document.getElementById('alert');
            setTimeout(() => {
                myAlert.hidden = false;
            }, 1000);
            setTimeout(() => {
                myAlert.hidden = true;
            }, 3000);
        },
        (err) => {
            const myModal2 = new bootstrap.Modal(document.getElementById("myModal2"));
            var myModalEl2 = document.getElementById('myModal2');
            var cancel = document.getElementById('cancel');
            var again = document.getElementById('again');
            myModalEl2.addEventListener('show.bs.modal', () => {
                cancel.addEventListener('click', () => {
                    myModal2.hide();
                    currentInfo.isSuccess = false;
                })
                again.addEventListener('click', () => {
                    currentInfo = getCurrent();
                    myModal2.hide();
                })
            })
            myModal2.show();
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    )
    var convertor = new BMap.Convertor();
    convertor.translate(currentPoint, 3, 5, function (data) {
        console.log(data);
    });
    return currentInfo;
}