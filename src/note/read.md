
# 基本知识点

### 场景对象Scene
```
let mesh = new THREE.Scene()
```
### 网格模型Mesh

#### 几何体对象Geometry
```
let geometry = new THREE.BoxGeometry(100,100,100)  //创建一个长方体
//或者
let geometry = new THREE.SphereGeometry(60,40,40) // 创建一个球体

let material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
})  // 材质对象


 let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中
```
|材质类型	|功能
|-----    | ----
|MeshBasicMaterial	|基础网格材质，不受光照影响的材质
|MeshLambertMaterial	|Lambert网格材质，与光照有反应，漫反射
|MeshPhongMaterial	|高光Phong材质,与光照有反应
|MeshStandardMaterial	|PBR物理材质，相比较高光Phong材质可以更好的模拟金属、玻璃效果


### 光源
#### 点光源
```
    var point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
```
#### 环境光
```
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
```
|光源	|简介
| ---- | ----
|AmbientLight	|环境光
|PointLight	|点光源
|DirectionalLight	|平行光，比如太阳光
|SpotLight	|聚光源

立体效果
仅仅使用环境光的情况下，你会发现整个立方体没有任何棱角感，这是因为环境光知识设置整个空间的明暗效果。如果需要立方体渲染要想有立体效果，需要使用具有方向性的点光源、平行光源等。



### 相机设置
```
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(200, 300, 200); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```

### 渲染器对象
```
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    renderer.render(scene, camera);
```


### 旋转动画    
1. 通过setInterval周期性调用渲染函数
```
function render() {
    renderer.render(scene,camera);//执行渲染操作
    mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
}
//间隔20ms周期性调用函数fun,20ms也就是刷新频率是50FPS(1s/20ms)，每秒渲染50次
setInterval("render()",20);
```

2. 通过requestAnimationFrame实现

 requestAnimationFrame()参数是将要被调用函数的函数名，requestAnimationFrame()调用一个函数不是立即调用而是向浏览器发起一个执行某函数的请求， 什么时候会执行由浏览器决定，一般默认保持60FPS的频率，大约每16.7ms调用一次requestAnimationFrame()方法指定的函数，60FPS是理想的情况下，如果渲染的场景比较复杂或者说硬件性能有限可能会低于这个频率。
```
function render() {
        renderer.render(scene,camera);//执行渲染操作
        mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
        requestAnimationFrame(render);//请求再次执行渲染函数render
    }
render();


均匀旋转

let T0 = new Date();//上次时间
function render() {
        let T1 = new Date();//本次时间
        let t = T1-T0;//时间差
        T0 = T1;//把本次时间赋值给上次时间
        requestAnimationFrame(render);
        renderer.render(scene,camera);//执行渲染操作
        mesh.rotateY(0.001*t);//旋转角速度0.001弧度每毫秒
    }
render();
```

### 辅助三维坐标系AxisHelper
为了方便预览调试，three.js提供了一个辅助三角坐标系
```
// 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
var axisHelper = new THREE.AxisHelper(250);
scene.add(axisHelper);
```

### 鼠标操作三维场景  
1. 通过npm 安装插件 
```
yarn add three-orbitcontrols 
```

2. 引入插件，进行监听控制 
```
import * as OrbitControls from 'three-orbitcontrols'


const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true
controls.dampingFactor = 0.25
// controls.enableZoom = false
```

### 顶点位置数据解析渲染

#### 自定义几何体
直接调用BoxGeometry直接创建一个立方体几何体，调用SphereGeometry创建一个球体几何体
```
var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
//类型数组创建顶点数据
var vertices = new Float32Array([
  0, 0, 0, //顶点1坐标
  50, 0, 0, //顶点2坐标
  0, 100, 0, //顶点3坐标
  0, 0, 10, //顶点4坐标
  0, 0, 100, //顶点5坐标
  50, 0, 10, //顶点6坐标
]);
// 创建属性缓冲区对象
var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;


// 三角面(网格)渲染模式
var material = new THREE.MeshBasicMaterial({
  color: 0x0000ff, //三角面颜色
  side: THREE.DoubleSide //两面可见
}); //材质对象
var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
```


#### 点模型Points  
为了更好的理解几何体是由顶点构成的，可以把几何体geometry作为点模型Points而不是网格模型Mesh的参数，你会发现上面的六个点坐标会渲染为六个方形的点区域，可以用下面代码代替上面的网格模型部分代码测试效果。
```
// 点渲染模式
var material = new THREE.PointsMaterial({
  color: 0xff0000,
  size: 10.0 //点对象像素尺寸
}); //材质对象
var points = new THREE.Points(geometry, material); //点模型对象
scene.add(points); //点对象添加到场景中
```

#### 线模型Line
下面代码是把几何体作为线模型Line参数，你会发现渲染效果是从第一个点开始到最后一个点，依次连成线。  
```
// 线条渲染模式
var material=new THREE.LineBasicMaterial({
    color:0xff0000 //线条颜色
});//材质对象
var line=new THREE.Line(geometry,material);//线条模型对象
scene.add(line);//线条对象添加到场景中
```


#### 几何体本质
你可以看出来立方体网格模型Mesh是由立方体几何体geometry和材质material两部分构成，立方体几何体BoxGeometry本质上就是一系列的顶点构成，只是Threejs的APIBoxGeometry把顶点的生成细节封装了，用户可以直接使用。比如一个立方体网格模型，有6个面，每个面至少两个三角形拼成一个矩形平面，每个三角形三个顶点构成，对于球体网格模型而言，同样是通过三角形拼出来一个球面，三角形数量越多，网格模型表面越接近于球形。  
```
var geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}); //材质对象Material
var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
```