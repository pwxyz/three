

import React from 'react';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols'

class Box extends React.Component {
  componentDidMount() {
    this.creat()
  }

  creat = () => {
    let scene = new THREE.Scene(); // 创建场景对象
    //创建网络模型
    // let geometry = new THREE.SphereGeometry(100, 100, 100) //创建一个球体几何对象
    let geometry = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象
    let material = new THREE.MeshLambertMaterial({
      color: 0x0000ff,
      // opacity: 0.7,
      // transparent: true,
      // specular: 0x4488ee,
      // shininess: 12
    }) // 材质对象 Material
    let mesh = new THREE.Mesh(geometry, material); //网格模型对象
    scene.add(mesh)

    //光源设置

    //点光源
    let point = new THREE.PointLight(0xffffff)
    point.position.set(400, 200, 300);  //设置点光源位置
    scene.add(point)  //添加点光源
    //环境光
    let ambient = new THREE.AmbientLight(0x444444)
    scene.add(ambient)  //添加环境光

    //相机设置
    let width = window.innerWidth;
    let height = window.innerHeight;
    let k = width / height; //窗口宽高比
    let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(200, 300, 200); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向

    //创建渲染对象
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); //设置渲染区域
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

    document.getElementById('box').appendChild(renderer.domElement)  //插入cavans元素 
    // renderer.render(scene, camera)


    // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
    var axesHelper = new THREE.AxesHelper(250);
    scene.add(axesHelper);

    let t0 = new Date()
    const renderCa = () => {
      let t1 = new Date()
      let t = t1 - t0
      t0 = t1
      requestAnimationFrame(renderCa)
      renderer.render(scene, camera)
      mesh.rotateY(0.001 * t)
    }
    renderCa()
    // setInterval(renderCa, 20)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true
    controls.dampingFactor = 0.25
    // controls.enableZoom = false
  }

  renderCa = () => {

  }

  render() {
    return (
      <div id='box'></div>
    )
  }
}

export default Box