import React from 'react';
// import data from '../json';
import dataArr from '../jsonArr';

class PageOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArr
    };
  }
  componentWillMount() {
    console.log(dataArr, 1111)
    let nowObj = {};
    for (let index = 0; index < dataArr.length; index++) {
      const element = dataArr[index];
      // 如果没有这个省
      if (!nowObj[element.province]) {
        nowObj[element.province] = { [element.city]: { '全市': [{ ...element }], [element.area]: [{ ...element }] } };
      }
      // 如果有这个省
      else {
        // 如果没有这个市
        if (!nowObj[element.province][element.city]) {
          nowObj[element.province][element.city] = { '全市': [{ ...element }], [element.area]: [{ ...element }] };
        }
        // 如果有这个市
        else {
          // 如果没有这个区
          if (!nowObj[element.province][element.city][element.area]) {
            nowObj[element.province][element.city]['全市'].push({ ...element });
            nowObj[element.province][element.city][element.area] = ([{ ...element }]);
          }
          else {
            nowObj[element.province][element.city]['全市'].push({ ...element });
            nowObj[element.province][element.city][element.area].push({ ...element });
          }
        }
      }
    }
    // localStorage.setItem('avcasd', JSON.stringify(nowObj));
    console.log(nowObj, 2222)
    let selectArr = [];
    let provinceIndex = 0;
    for (const key in nowObj) {
      if (nowObj.hasOwnProperty(key)) {
        selectArr.push({ value: key, label: key, children: [] });
        const provinceElement = nowObj[key];
        let cityIndex = 0;
        for (const cityKey in provinceElement) {
          if (provinceElement.hasOwnProperty(cityKey)) {
            selectArr[provinceIndex].children.push({ value: cityKey, label: cityKey, children: [] });
            const cityElement = provinceElement[cityKey];
            // if (cityKey === '黄石市') {
            //   debugger
            // }
            for (const areaKey in cityElement) {
              if (cityElement.hasOwnProperty(areaKey)) {
                selectArr[provinceIndex].children[cityIndex].children.push({ value: areaKey, label: areaKey });
              }
            }
            cityIndex++;
          }
        }
        provinceIndex++
      }
    }
    localStorage.setItem('selectArr', JSON.stringify(selectArr));
    console.log(selectArr)
  }
  getDom = () => {
    let html = [];
    const { data } = this.state;
    {
      Object.keys(data).forEach((key) => (
        html.push(<p>{key}</p>)
      ))
    }
    return html;
  }
  render() {
    return (
      <div>
        {/* {this.getDom()} */}

      </div>
    );
  }
}

export default PageOne;
