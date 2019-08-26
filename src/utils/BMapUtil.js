/**
 * 浅复制，除了lng,lat属性
 *
 * @param {Object} target 浅复制目标对象
 * @param {Object} obj 被复制对象
 */
const assignExcludeLngAndLat = (target, obj) => {
  const { lng, lat, ...others } = obj;
  console.log(lng, lat);
  Object.assign(target, others);
};

/**
 * 原始GPS坐标转百度地图坐标
 *
 * @param {Array} points 转换前的点数组
 * @param {BMap} BMap 地图类
 * @return {Promise} 转换后的Promise
 */
const GPSCoordinatesToBaidus = function(points, BMap) {
  const translate = (points10, convertor) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        convertor.translate(points10, 1, 5, data => {
          if (data.status === 0) {
            resolve(data.points, BMap);
          } else {
            reject(data);
          }
        });
      }, 100);
    });
  };

  const len = 10;
  const pLen = points.length;
  const count = Math.ceil(pLen / len);

  const convertor = new BMap.Convertor();
  const resultPromises = [];

  for (let i = 0; i < count; i++) {
    const start = i * len;
    const end = i * len + len;
    resultPromises.push(translate(points.slice(start, end), convertor));
  }

  return Promise.all(resultPromises)
    .then(results => {
      let newPoints = [];
      if (results && results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          newPoints = newPoints.concat(results[i]);
        }
      } else {
        newPoints = [];
      }

      for (let j = 0; j < points.length; j++) {
        assignExcludeLngAndLat(newPoints[j], points[j]);
      }
      return Promise.resolve(newPoints);
    })
    .catch(data => {
      console.log("原始GPS坐标转百度地图坐标失败：", data);
    });
};

/**
 * 根据百度坐标系点数组批量转成标志物
 *
 * @param {Array} translatedPoints 百度坐标系点对象数组
 * @param {Function} getIconObj 自定义icon对象函数
 * @return {Promise} 标志物Promise
 */
const createMarkers = (translatedPoints, getIconObj, BMap) => {
  return Promise.resolve(
    translatedPoints.map(p => {
      const marker = new BMap.Marker(
        p,
        getIconObj ? { icon: getIconObj(p) } : {}
      );
      assignExcludeLngAndLat(marker, p);
      return marker;
    })
  );
};

/**
 * 原始GPS坐标点生成标志物数组
 *
 * @param {Array} gpsPoints 原始GPS坐标数组
 * @param {Function} getIconObj 标志物自定义icon函数
 * @return {Promise} 标志物Promise
 */
const produceMarkers = (gpsPoints, getIconObj) => {
  return GPSCoordinatesToBaidus(gpsPoints).then((translatedPoints, BMap) => {
    return createMarkers(translatedPoints, getIconObj, BMap);
  });
};

export { GPSCoordinatesToBaidus, createMarkers, produceMarkers };
