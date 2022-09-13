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
map.setMinZoom(16);     //最小展示级别
map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
map.setMapStyleV2({     
    styleId: 'af09776652e1308ed209179eda981505'     //个性化地图id
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
        myModal.hide();     //隐藏modal
        setMarker(pointName, pointCoordinate);      //设计地图标记

    })
    allow.addEventListener('click', () => {
        var currentInfo = getCurrent();         //获取当前位置
        currentPoint = currentInfo.currentPoint;    //当前位置
        isSuccess = currentInfo.isSuccess;      //获取当前位置是否成功
        //设置起终点选项
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
myModal.show();     //显示modal




//步行路线规划
var startPoint = new BMap.Point();      //起终点坐标
var endPoint = new BMap.Point();
var alert2 = document.getElementById("alert2");     //用户所选起终点相同时的警告
var alert3 = document.getElementById('alert3');     //路线规划完成时提示
var confirm = document.getElementById("confirm");   
var walk = new BMap.WalkingRoute(map, {
    renderOptions: {
        autoViewport: true      //自动设置最佳视野
    }
});
var chartData = [];     //路线的坐标详情Array<poing>
var polyline;
var stMarker, endMarker;
var stIcon = new BMap.Icon('./icons/startIcon.png', new BMap.Size(12, 15));
var endIcon = new BMap.Icon('./icons/endIcon.png', new BMap.Size(12, 15));
console.log(stIcon);
confirm.addEventListener('click', () => {
    //清空覆盖物和上一次规划的路线
    map.removeOverlay(polyline);
    map.removeOverlay(stMarker);
    map.removeOverlay(endMarker);
    walk.clearResults();

    if (startOptionsValue == -1) {  //起点是当前位置
        walk.search(pointCoordinate[startOptionsValue][0], pointCoordinate[endOptionsValue][1]);
    } else if(startOptionsValue == endOptionsValue) {   //起点和终点相同
        alert2.hidden = false;
        setTimeout(() => {
            alert2.hidden = true;
        }, 1000); 
    } else {       //正常情况
        console.log(path);
        planPath(path.length - 1);    //规划路径
        //起点终点的标注
        stMarker = new BMap.Marker(new BMap.Point(allpoint[path[path.length - 1]][0], allpoint[path[path.length - 1]][1]), {
            icon: stIcon
        });
        endMarker = new BMap.Marker(new BMap.Point(allpoint[path[0]][0], allpoint[path[0]][1]), {
            icon:endIcon
        });
        map.addOverlay(stMarker);
        map.addOverlay(endMarker);
        setTimeout(() => {  //停留一秒，等待路径规划完成
            //将规划好的路径添加为线覆盖物
            polyline = new BMap.Polyline(chartData, {   
                strokeColor: "blue",
                strokeWeight: 6,
                strokeOpacity: 0.5
            });
            map.addOverlay(polyline);
            //设置最佳视野
            var view = map.getViewport(chartData);
            map.setCenter(view.center);
            map.setZoom(view.zoom);
            //路线规划完成提示
            alert3.hidden = false;
            setTimeout(() => {
                alert3.hidden = true;
            }, 1000);   
            chartData = [];
        }, 1500);    
    }
})


//根据path生成chartData(递归)
function planPath(i) {
    if (i < 1) return;
    startPoint.lng = allpoint[path[i]][0];
    startPoint.lat = allpoint[path[i]][1];
    endPoint.lng = allpoint[path[i - 1]][0];
    endPoint.lat = allpoint[path[i - 1]][1];
    walk.search(startPoint, endPoint);
    //路径规划完成的回调函数
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
        (pos) => {      //成功的回调：将当前坐标信息赋给currentPoint，并提示成功
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
        (err) => {      //失败的回调：提示用户获取失败，是否重新获取
            const myModal2 = new bootstrap.Modal(document.getElementById("myModal2"));
            var myModalEl2 = document.getElementById('myModal2');
            var cancel = document.getElementById('cancel');
            var again = document.getElementById('again');
            myModalEl2.addEventListener('show.bs.modal', () => {
                cancel.addEventListener('click', () => {
                    myModal2.hide();
                    currentInfo.isSuccess = false;
                })
                again.addEventListener('click', () => {     //若点击重新获取，重新调用getCurrent()函数
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
    //将获取的WGS84坐标转换为百度的bd09坐标
    var convertor = new BMap.Convertor();
    convertor.translate(currentPoint, 3, 5, function (data) {
        console.log(data);
    });
    return currentInfo;
}