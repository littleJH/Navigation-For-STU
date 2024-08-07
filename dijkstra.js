import {
    pointCoordinate
} from "./allpoint.js";
import { pointName } from "./point.js";
import {
    arr
} from "./arry.js";
const COUNT = pointCoordinate.length;
const INF = 65535;

var map = new BMap.Map();
var matrix = new Array(COUNT);
var st = new BMap.Point();
var en = new BMap.Point();
setMatrix();    //赋值邻接矩阵

//获取起点、终点信息
var start = document.getElementById("start-select");
var end = document.getElementById("end-select");
var myAlert = document.getElementById("alert2");
var startOptionsValue = -1;
var endOptionsValue = -2;
start.addEventListener("change", () => {
    startOptionsValue = start.options[start.selectedIndex].value;
    if (startOptionsValue == -1) {      //选择起点为当前位置
        console.log("起点：当前位置");
    } else if(startOptionsValue == endOptionsValue) {       //起终点相同
        myAlert.hidden = false;
        setTimeout(() => {
            myAlert.hidden = true;      //提示用户起终点相同
        }, 1000); 
    } else {
        console.log("起点：", pointName[startOptionsValue]);
        Dijkstra(startOptionsValue);
        if(endOptionsValue != -2) {     //正确选择起终点
            getPath(startOptionsValue, endOptionsValue);
        }
    }
});
end.addEventListener("change", () => {
    endOptionsValue = end.options[end.selectedIndex].value;
    console.log("终点：", pointName[endOptionsValue]);
    if (startOptionsValue != -1 && startOptionsValue != endOptionsValue) {      //起点非当前位置且起终点不同
        getPath(startOptionsValue, endOptionsValue);
    } else if (startOptionsValue == endOptionsValue) {         //起终点相同
        myAlert.hidden = false;
        setTimeout(() => {
            myAlert.hidden = true;      //提示
        }, 1000); 
    }
});

// 定义图结构  
function MGraph() {
    this.vexs = []; //顶点表
    this.arc = []; // 邻接矩阵，可看作边表
    this.numVertexes = null; //图中当前的顶点数
    this.numEdges = null; //图中当前的边数
}
var G = new MGraph(); //创建图使用
var numVertexes = 74, //定义顶点数
    numEdges = 149; //定义边数
var Pathmatirx = [] // 用于存储最短路径下标的数组，下标为各个顶点，值为下标顶点的前驱顶点
var ShortPathTable = [] //用于存储到各点最短路径的权值和
var path = [];  //最优路径
createMGraph();


//创建图
function createMGraph() {
    G.numVertexes = numVertexes; //设置顶点数
    G.numEdges = numEdges; //设置边数

    //录入顶点信息
    for (let i = 0; i < G.numVertexes; i++) {
        G.vexs[i] = i; //scanf('%s'); //ascii码转字符 //String.fromCharCode(i + 65);
    }

    //邻接矩阵初始化
    for (let i = 0; i < G.numVertexes; i++) {
        G.arc[i] = [];
        for (let j = 0; j < G.numVertexes; j++) {
            G.arc[i][j] = matrix[i][j]; //INFINITY; 
        }
    }
}

function Dijkstra(Vm) {
    let k, min;
    let final = [];
    for (let v = 0; v < G.numVertexes; v++) {
        final[v] = 0;
        ShortPathTable[v] = G.arc[Vm][v];
        Pathmatirx[v] = 0;
    }
    ShortPathTable[0] = 0;
    final[0] = 1;

    for (let v = 1; v < G.numVertexes; v++) { //初始化数据
        min = 65535;
        for (let w = 0; w < G.numVertexes; w++) { //寻找离V0最近的顶点
            if (!final[w] && ShortPathTable[w] < min) {
                k = w;
                min = ShortPathTable[w]; //w 顶点离V0顶点更近
            }
        }
        final[k] = 1; //将目前找到的最近的顶点置位1
        for (let w = 0; w < G.numVertexes; w++) { //修正当前最短路径及距离
            if (!final[w] && (min + G.arc[k][w] < ShortPathTable[w])) { //说明找到了更短的路径，修改Pathmatirx[w]和ShortPathTable[w]
                ShortPathTable[w] = min + G.arc[k][w];
                Pathmatirx[w] = k;
            }
        }
    }
}

function getPath(startOptionsValue, endOptionsValue) {
    path = [];
    //打印V0-Vn最短路径
    console.log("%s-%s 最小权值和: %d", G.vexs[startOptionsValue], G.vexs[endOptionsValue], ShortPathTable[endOptionsValue]);
    //打印最短路线

    let temp = endOptionsValue,
        str = '';
    let i = 0;

    while (temp != 0) {
        str = '->' + G.vexs[temp] + str;
        if (temp != 0) {
            path[i] = G.vexs[temp];
            i++;
        }
        temp = Pathmatirx[temp];
    }
    path[i] = startOptionsValue;
    // str = '0' + str;
    console.log('最短路线：' + str);
}

function setMatrix() {
    for (let i = 0; i < pointCoordinate.length; i++) {
        matrix[i] = new Array(COUNT);
    }
    
    for (let i = 0; i < pointCoordinate.length; i++) {
        for (let j = 0; j < pointCoordinate.length; j++) {
            matrix[i][j] = INF;
        }
    }
    
    for (let i = 0; i < pointCoordinate.length; i++) {
        for (let j = 0; j < pointCoordinate.length; j++) {
            if (i == j) {
                matrix[i][j] = 0;
            }
        }
    }
    
    for (let k = 0; k < arr.length; k++) {
        var s = arr[k][0] - 1;
        var e = arr[k][1] - 1;
        st.lng = pointCoordinate[s][0];
        st.lat = pointCoordinate[s][1];
        en.lng = pointCoordinate[e][0];
        en.lat = pointCoordinate[e][1];
        matrix[s][e] = matrix[e][s] = map.getDistance(st, en);
    }
}

export {
    path,
    startOptionsValue,
    endOptionsValue
}