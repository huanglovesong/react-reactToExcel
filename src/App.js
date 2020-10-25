
import React, { Component } from 'react'
import logo from './logo.svg';
import * as XLSX from 'xlsx';
import './App.css';
// var fs = require("fs")
import BMap from 'BMap';

import MobileDetect from 'mobile-detect';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.arr = [];
    this.noArr = [];
    this.failArr = [];
  }
  componentDidMount() {


    // 百度地图API功能
    this.map = new BMap.Map("allmap");
    let lng = 115.309043, lat = 30.550317;
    var point = new BMap.Point(lng, lat);
    this.map.centerAndZoom(point, 11);
    this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
  }
  clickSearch = () => {
    //设置地图
    var city = document.getElementById("cityName").value;

    this.theLocation(city);

  }
  clickSearchMul = () => {
    let arr = ["武汉市曙光星城C区", "武汉市金融港B27", "武汉市黄鹤楼", "武汉市汉口火车站", "武汉市武昌火车站", "武汉市武汉站"];
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      this.theLocation(element);
    }
  }
  theLocation = (keyword) => {
    //设置地图
    if (keyword != "") {
      this.map.centerAndZoom(keyword, 11);      // 用城市名设置地图中心点
    }
    var localSearch = new BMap.LocalSearch(this.map);
    localSearch.enableAutoViewport(); //允许自动调节窗体大小
    const that = this;
    localSearch.setSearchCompleteCallback(function (searchResult) {
      var poi = searchResult.getPoi(0);
      console.log(searchResult, 55333);
      if (poi) {
        let lng = poi.point.lng; //获取经度和纬度，将结果显示在文本框中
        let lat = poi.point.lat; //获取经度和纬度，将结果显示在文本框中
        document.getElementById("jingdu").value = lng; //获取经度和纬度，将结果显示在文本框中
        document.getElementById("weidu").value = lat; //获取经度和纬度，将结果显示在文本框中
        console.log(that.arr, 2222);
        that.map.centerAndZoom(new BMap.Point(lng, lat), 18);
        var marker = new BMap.Marker(new BMap.Point(lng, lat));
        that.map.addOverlay(marker);
      } else {
        that.noArr.push({ keyword });
      }

    });
    localSearch.search(keyword);
  }
  theLocationItem = (item) => {
    let name = item.name;
    //设置地图
    if (item.name != "") {
      this.map.centerAndZoom(item.name, 11);      // 用城市名设置地图中心点
    }
    var localSearch = new BMap.LocalSearch(this.map);
    localSearch.enableAutoViewport(); //允许自动调节窗体大小
    const that = this;
    localSearch.setSearchCompleteCallback(function (searchResult) {
      var poi = searchResult.getPoi(0);
      if (poi) {
        let lng = poi.point.lng; //获取经度和纬度，将结果显示在文本框中
        let lat = poi.point.lat; //获取经度和纬度，将结果显示在文本框中
        delete item.name;
        that.arr.push({ ...item, lat, lng, name });
        console.log(that.arr, 2222);
      } else {
        that.failArr.push(item);
        console.log(that.failArr, '查询失败');
      }
    });
    localSearch.search(item.name);
  }
  onImportExcel = file => {
    // 获取上传的文件对象
    const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            // break; // 如果只取第一张表，就取消注释这行
          }
        }
        console.log(data, 1111)
        // data = data.slice(4900, 5500);
        for (let index = 0; index < data.length; index++) {
          const item = data[index];
          this.arr.push(item);
        }
        const nowData = data.map(o => {
          return {
            'restaurantName': o['餐厅名称'],
            'restaurantChangeName': o['福禄调整后餐厅名称'],
            'restaurantId': o['餐厅编码'],
            'lonAndLat': o['经纬度'],
            'province': o['省'],
            'city': o['市'],
            'area': o['区'],
            'detailAddress': o['详细地址'],
            'phoneShowAddress': o['手机点餐显示名称'],
          }
        });
        // fs.writeFileSync("./1.txt",JSON.stringify(nowData))
        // localStorage.setItem("aa",JSON.stringify(nowData));
        console.log(nowData, 111);
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        console.log('文件类型不正确');
        return;
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  }
  exportInf = (type) => {
    console.log(this[type]);
    console.log(JSON.stringify(this[type]), type);
    var columname = ["restaurantName", "restaurantChangeName", "restaurantId", "lonAndLat", "province", "city", "area", "detailAddress"];
    // var columname = ["餐厅名称","福禄调整后餐厅名称", "餐厅编码", "经纬度", "省", "市", "区", "详细地址","手机点餐显示名称"];

    this.JSONToExcelConvertor(this[type], "地区数据表", columname);
  }
  JSONToExcelConvertor(JSONData, FileName, title, filter) {
    if (!JSONData)
      return;
    //转化json为object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = "<table>";

    //设置表头  
    var row = "<tr>";

    if (title) {
      //使用标题项
      for (var i in title) {
        row += "<th align='center'>" + title[i] + '</th>';
      }

    }
    else {
      //不使用标题项
      for (var i in arrData[0]) {
        row += "<th align='center'>" + i + '</th>';
      }
    }

    excel += row + "</tr>";

    //设置数据  
    for (var i = 0; i < arrData.length; i++) {
      var row = "<tr>";

      for (var index in arrData[i]) {
        //判断是否有过滤行
        if (filter) {
          if (filter.indexOf(index) == -1) {
            var value = arrData[i][index] == null ? "" : arrData[i][index];
            row += '<td>' + value + '</td>';
          }
        }
        else {
          var value = arrData[i][index] == null ? "" : arrData[i][index];
          row += "<td align='center'>" + value + "</td>";
        }
      }

      excel += row + "</tr>";
    }

    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";


    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    return (
      <div>
        <div id="allmap"></div>
        <div id="r-result">
          地名: <input id="cityName" type="text" placeHolder="地名" />
          <input type="text" id="jingdu" placeHolder="精度" />
          <input type="text" id="weidu" placeHolder="纬度" />
          <input type="button" value="查询" id="btn" onClick={this.clickSearch} />
          <input type="button" value="批量查询" id="btnMul" onClick={this.clickSearchMul} />
          <input type='file' accept='.xlsx, .xls' onChange={this.onImportExcel} />
          <input type="button" value="输出arr" onClick={() => this.exportInf('arr')} />
          <input type="button" value="输出failArr" onClick={() => this.exportInf('failArr')} />
          <input type="button" value="输出noArr" onClick={() => this.exportInf('noArr')} />
          <input type="button" value="输出设备号" onClick={this.exportUUID} />
        </div>
      </div>
    )
  }
}

