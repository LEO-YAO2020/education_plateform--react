import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";

const pieChart = (props) => {
  let { data } = props;
  let { title } = props;

  let { type } = props;
  const [option, setOption] = useState();

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!title) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].amount;
      }
      data = data.map((item) => {
        return {
          name: `${item.name}: ${Math.round((item.amount / sum) * 100, 1)}%`,
          y: Math.round((item.amount / sum) * 100),
        };
      });
    } else {
      data = [
        {
          name: `female: ${Math.round(
            (data.gender.female / data.total) * 100,
            1
          )}%`,
          y: Math.round((data.gender.female / data.total) * 100),
        },
        {
          name: `male: ${Math.round(
            (data.gender.male / data.total) * 100,
            1
          )}%`,
          y: Math.round((data.gender.male / data.total) * 100),
        },
        {
          name: `unknown: ${Math.round(
            (data.gender.unknown / data.total) * 100,
            1
          )}%`,
          y: Math.round((data.gender.unknown / data.total) * 100),
        },
      ];

      console.log(data);
    }

    setOption({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: title ? title : type,
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
      series: [
        {
          name: "percentage",
          colorByPoint: true,
          data: data,
        },
      ],
    });
  }, [type]);
  return (
    <HighchartsReact
      options={option}
      highcharts={HighCharts}
      constructorType={"chart"}
    />
  );
};

export default pieChart;
