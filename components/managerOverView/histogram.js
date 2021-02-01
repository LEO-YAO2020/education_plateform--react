import React, { useEffect, useState, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";
import uniq from "uniq";

const histogram = (props) => {
  const { interest } = props.data.studentData;
  const { skills } = props.data.teacherData;
  const [option, setOption] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Student VS Teacher",
    },
    subtitle: {
      text: "Comparing what students are interested in and teachers’ skills",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Interested VS Skills",
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return this.series.name === "Interest"
          ? `${this.series.name}: ${this.y}`
          : `<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>total: ${this.point.stackTotal}`;
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
  });
  const SkillDes = ["Know", "Practiced", "Comprehend", "Expert", "Master"];

  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;

    setTimeout(() => {
      chart.reflow();
    }, 30);
    return () => {};
  }, []);

  function down(x, y) {
    return x.name < y.name ? 1 : -1;
  }

  useEffect(() => {
    const xCategories = uniq([
      ...interest.map(({ name }) => name),
      ...Object.keys(skills),
    ]);
    xCategories.sort();

    let interestData = xCategories.reduce(
      (acc, language) => {
        const target = interest.find((item) => item.name === language);

        acc.data.push(target ? target.amount : 0);
        return acc;
      },
      { name: "Interest", stack: "interest", data: [] }
    );

    let level = uniq(
      Object.values(skills)
        .flat()
        .map((item) => item.level)
    ).sort();

    let skillData = level.map((level) => {
      return {
        name: SkillDes[level],
        data: xCategories.map(
          (lan) =>
            skills[lan]?.find((item) => item.level === level)?.amount || 0
        ),
        stack: "teacher",
      };
    });

    setOption({
      xAxis: {
        type: "category",
        labels: {
          rotation: -45,
          style: {
            fontSize: "13px",
            fontFamily: "Verdana, sans-serif",
          },
        },
        categories: xCategories,
      },
      series: [interestData, ...skillData],
    });
  }, [props.data]);

  return (
    <HighchartsReact options={option} highcharts={HighCharts} ref={charRef} />
  );
};

export default histogram;
