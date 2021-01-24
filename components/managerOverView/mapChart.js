import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import HighCharts from "highcharts/highmaps";
import { getWorld } from "../../api/response";

const mapChart = (props) => {
  const { country } = props.data;
  const title = props.title;

  const [world, setWorld] = useState(null);
  const [option, setOption] = useState({
    title: {
      text: null,
    },

    colorAxis: {
      min: 0,
      stops: [
        [0, "#EFEFFF"],
        [0.5, HighCharts.getOptions().colors[0]],
        [1, "#1890ff"],
      ],
    },
    legend: {
      layout: "vertical",
      align: "left",
      verticalAlign: "bottom",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    (async () => {
      const res = await getWorld();

      setWorld(res.data);
      setOption({
        series: [{ mapData: res.data }],
      });
    })();
  }, []);

  useEffect(() => {
    if (!country || !world) {
      return;
    }

    const mapSource = country.map((item) => {
      const target = world.features.find(
        (feature) =>
          item.name.toLowerCase() === feature.properties.name.toLowerCase()
      );

      return !!target
        ? {
            "hc-key": target.properties["hc-key"],
            value: item.amount,
          }
        : {};
    });
    const options = {
      title: {
        text: title,
      },
      series: [
        {
          data: mapSource,
          mapData: world,
          name: "Total",
          states: {
            hover: {
              color: "#a4edba",
            },
          },
        },
      ],
    };

    setOption(options);
  }, [world, country]);

  return (
    <HighchartsReact
      options={option}
      highcharts={HighCharts}
      constructorType={"mapChart"}
      containerProps={{ className: "chartContainer" }}
    />
  );
};

export default mapChart;
