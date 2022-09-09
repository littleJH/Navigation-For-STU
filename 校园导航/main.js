import {
    pointName,
    pointCoordinate
} from "./point.js";

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


//获取起点、终点信息
var startOptionsValue;
var endOptionsValue;
var startPoint = new BMap.Point();
var endPoint = new BMap.Point();
start.addEventListener("change", () => {
    if (start.options[start.selectedIndex].value == -1) {
        startPoint = currentPoint;
        console.log("起点：当前位置", startPoint, );
    } else {
        startOptionsValue = start.options[start.selectedIndex].value;
        startPoint.lng = pointCoordinate[startOptionsValue][0];
        startPoint.lat = pointCoordinate[startOptionsValue][1];
        console.log("起点：", pointName[startOptionsValue], startPoint, );
    }
});
end.addEventListener("change", () => {
    endOptionsValue = end.options[end.selectedIndex].value;
    endPoint.lng = pointCoordinate[endOptionsValue][0];
    endPoint.lat = pointCoordinate[endOptionsValue][1];
    console.log("终点：", pointName[endOptionsValue], endPoint);
});


//步行路线规划
var confirm = document.getElementById("confirm");
var walk = new BMap.WalkingRoute(map, {
    renderOptions: {
        map: map
    }
});
confirm.addEventListener('click', () => {
    walk.clearResults(); //清除最近一次检索的结果
    var start = new BMap.Point(startPoint.lng, startPoint.lat);
    var end = new BMap.Point(endPoint.lng, endPoint.lat);
    walk.search(start, end);
})



// var polyline = new BMap.Polyline([
//     new BMap.Point(116.63550347222223,23.41050835503472),
//     new BMap.Point(116.62960394965278,23.418399251302084)
//     ],
//     {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}
//     );
// map.addOverlay(polyline);

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