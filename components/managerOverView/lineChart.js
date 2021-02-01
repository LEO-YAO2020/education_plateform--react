import React, { useEffect, useState, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";

const lineChart = (props) => {
  const studentCtime = props.data.studentData.ctime;
  const teacherCtime = props.data.teacherData.ctime;
  const courseCtime = props.data.coursesData.ctime;

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
        text: "New Students",
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  let studentArr = [];
  let teacherArr = [];
  let courseArr = [];

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

  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;

    setTimeout(() => {
      chart.reflow();
    }, 30);
    return () => {};
  }, []);

  useEffect(() => {
    sortData(studentCtime, studentArr);
    sortData(teacherCtime, teacherArr);
    sortData(courseCtime, courseArr);

    setOption({
      series: [
        {
          name: "Increment Amount",
          data: studentArr,
        },
        {
          name: "Teacher",
          data: teacherArr,
        },
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
