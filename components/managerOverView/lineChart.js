import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";

const lineChart = (props) => {
  const studentCtime = props.data.studentData.ctime;
  const teacherCtime = props.data.teacherData.ctime;
  const [option, setOption] = useState(null);

  let studentArr = [];
  let teacherArr = [];

  function sortData(ctime, arr) {
    let j = 0;

    let data = ctime.map((item) => {
      return { time: parseInt(item.name.slice(-2)), amount: item.amount };
    });

    for (let i = 1; i <= 12; i++) {
      if (data[j]?.time === i) {
        arr.push(data[j].amount);
        j++;
      } else {
        arr.push(0);
      }
    }
  }

  useEffect(() => {
    sortData(studentCtime, studentArr);
    sortData(teacherCtime, teacherArr);

    setOption({
      chart: {
        type: "line",
      },
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
          text: "New Students",
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      plotOptions: {
        line: {
          enableMouseTracking: false,
        },
      },
      series: [
        {
          name: "Increment Amount",
          data: studentArr,
        },
        {
          name: "Teacher",
          data: teacherArr,
        },
      ],
    });
  }, []);
  return (
    <HighchartsReact
      options={option}
      highcharts={HighCharts}
      constructorType={"chart"}
    />
  );
};

export default lineChart;
