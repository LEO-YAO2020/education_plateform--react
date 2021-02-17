import React, { useEffect, useState, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";

const lineChart = (props) => {
  const courseCtime = props.data.coursesData.createdAt;
  console.log(props);
  const [option, setOption] = useState({
    title: null,
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yAxis: {
      title: {
        text: "Increment",
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;

    const timer = setTimeout(() => {
      chart.reflow();
    }, 30);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let courseArr = new Array(12).fill(0).map((_, index) => {
      const month = index + 1;
      const name = month > 9 ? month + "" : "0" + month;
      const target = courseCtime.find(
        (item) => item.name.split("-")[1] === name
      );

      return (target && target.amount) || 0;
    });
    setOption({
      series: [
        {
          name: "Course",
          data: courseArr,
        },
      ],
    });
  }, [props.data]);
  return (
    <HighchartsReact options={option} highcharts={HighCharts} ref={charRef} />
  );
};

export default lineChart;
