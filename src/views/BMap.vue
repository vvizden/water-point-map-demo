<template>
  <baidu-map
    class="map"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    @ready="handleBMapReady"
  >
    <h1 class="map-title">{{ year }}年郑州市中心城区易涝点位置分布图</h1>
    <aside class="aside-list">
      <a-list size="small" :split="true" :dataSource="data1">
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          :style="{ color: item.labelStyle.backgroundColor }"
          >{{ `${item.index2}、${item.stnm}` }}</a-list-item
        >
        <div slot="header" :style="{ color: color1 }">一类隐患区域</div>
      </a-list>
      <a-list size="small" :split="true" :dataSource="data2">
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          :style="{ color: item.labelStyle.backgroundColor }"
          >{{ `${item.index2}、${item.stnm}` }}</a-list-item
        >
        <div slot="header" :style="{ color: color2 }">二类隐患区域</div>
      </a-list>
      <a-list size="small" :split="true" :dataSource="data3">
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          :style="{ color: item.labelStyle.backgroundColor }"
          >{{ `${item.index2}、${item.stnm}` }}</a-list-item
        >
        <div slot="header" :style="{ color: color3 }">三类隐患区域</div>
      </a-list>
    </aside>
    <bm-view style="width: 100%; height:200px;flex: 1;"></bm-view>
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <bm-label
      v-for="item of labels"
      :key="item.id"
      :content="item.index2"
      :position="item"
      :labelStyle="item.labelStyle"
      :offset="{ width: -16, height: -32 }"
    />
  </baidu-map>
</template>

<script>
import axios from "axios";
import { GPSCoordinatesToBaidus } from "../utils/BMapUtil";

export default {
  props: {
    year: {
      type: String,
      default: "2019"
    }
  },
  data() {
    return {
      // 113.61754708198265   34.79410888660694
      center: { lng: 113.64754708198265, lat: 34.81410888660694 },
      zoom: 13,
      data1: [],
      data2: [],
      data3: [],
      color1: "#2f54eb",
      color2: "#fa541c",
      color3: "#52c41a"
    };
  },
  computed: {
    labels() {
      return [].concat(this.data1, this.data2, this.data3);
    }
  },
  methods: {
    getList(year, type) {
      return axios.get("http://172.16.22.146:41461/baseInfo/test/list", {
        params: {
          year,
          type
        }
      });
    },
    handleBMapReady(obj) {
      axios
        .all([
          this.getList(this.year, 1),
          this.getList(this.year, 2),
          this.getList(this.year, 3)
        ])
        .then(
          axios.spread((resp1, resp2, resp3) => {
            let data1 = resp1.data ? resp1.data : [];
            let data2 = resp2.data ? resp2.data : [];
            let data3 = resp3.data ? resp3.data : [];

            this.data1 = this.mapToBMapPoints(data1, e => {
              let labelStyle = this.gentLabelStyle();
              labelStyle.backgroundColor = this.color1;
              return labelStyle;
            });

            this.data2 = this.mapToBMapPoints(data2, e => {
              let labelStyle = this.gentLabelStyle();
              labelStyle.backgroundColor = this.color2;
              return labelStyle;
            });

            this.data3 = this.mapToBMapPoints(data3, e => {
              let labelStyle = this.gentLabelStyle();
              labelStyle.backgroundColor = this.color3;
              return labelStyle;
            });

            setTimeout(() => {
              obj.map.reset();
              //   obj.map.setZoom(13);
            }, 500);

            //   GPSCoordinatesToBaidus(mapToBMapPoints(data), obj.BMap).then(
            //     data => {
            //       this.data = data;
            //       console.log(this.data);
            //     }
            //   );
          })
        );
    },
    gentLabelStyle() {
      return {
        color: "#fff",
        fontSize: "0.5rem",
        border: "none",
        backgroundColor: "#2f54eb",
        display: "inline-block",
        textAlign: "center",
        borderRadius: "50%",
        width: "2em",
        height: "2em",
        lineHeight: "2em"
      };
    },
    mapToBMapPoints(arr, styleFun) {
      return arr.map(e => {
        e.lng = e.lgtd;
        e.lat = e.lttd;
        e.index2 = "" + e.index2;
        e.labelStyle = styleFun(e);
        return e;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 1260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #fff;
}

.map-title {
  font-size: 3rem;
  position: absolute;
  top: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 1);
  line-height: 1;
  margin: 0;
  padding: 0 8px 8px;
}

.aside-list {
  position: absolute;
  left: 0;
  top: calc(3rem * 1.5 + 3rem * 0.5);
  //   top: 0;
  //   width: auto;
  width: 340px;
  height: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  //   transform: translate(0, -50%);
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
}
</style>

<style lang="scss">
.aside-list {
  .ant-list {
    // float: left;
    .ant-list-header {
      padding: 2px 0;
      font-size: 1.1rem;
      line-height: 1;
      font-weight: 700;
    }
    .ant-list-item {
      font-size: 1rem;
      line-height: 1;
      padding: 1px 0;
    }
  }
}
</style>
