import React, { useEffect, useState, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";

const pieChart = (props) => {
  let { data } = props;
  let { title } = props;
  let { type } = props;

  const [option, setOption] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },

    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
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

    setTimeout(() => {
      chart.reflow();
    }, 30);
    return () => {};
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const source = data.map((item) => ({ name: item.name, y: item.amount }));
    const titleText = title?.split(/(?=[A-Z])/).join(" ");
    console.log(typeof titleText === "undefined");
    typeof titleText === "undefined"
      ? setOption({
          subtitle: {
            text: `total: ${source.reduce((acc, cur) => acc + cur.y, 0)}`,
            align: "right",
          },
          series: [
            {
              name: "percentage",
              colorByPoint: true,
              data: source,
            },
          ],
        })
      : setOption({
          title: {
            text: `<span style="text-transform: capitalize">${titleText}</span>`,
          },
          subtitle: {
            text: `${titleText.split(" ")[0]} total: ${source.reduce(
              (acc, cur) => acc + cur.y,
              0
            )}`,
            align: "right",
          },
          series: [
            {
              name: "percentage",
              colorByPoint: true,
              data: source,
            },
          ],
        });
  }, [type]);
  return (
    <HighchartsReact options={option} highcharts={HighCharts} ref={charRef} />
  );
};

export default pieChart;
