import React, { useEffect } from "react";
import styled from "styled-components";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

const goBack = () => {
  useEffect(() => {
    let goTop = document.querySelector(".goBack");
    let sliderBar = document.querySelector(".slider-bar");
    let list = document.querySelector(".container");
    let bannerTop = list.offsetTop;

    document.addEventListener("scroll", () => {
      if (window.pageYOffset >= bannerTop) {
        sliderBar.style.position = "fixed";
        sliderBar.style.top = 500 + "px";
      } else {
        sliderBar.style.position = "absolute";
        sliderBar.style.top = "500px";
      }

      if (window.pageYOffset >= 500) {
        goTop.style.display = "block";
      } else {
        goTop.style.display = "none";
      }
    });

    goTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "500px",
        marginRight: "10px",
        width: "45px",
        height: "40px",
      }}
      className="slider-bar"
    >
      <span
        className="goBack"
        style={{
          display: "none",
          position: "absolute",
          bottom: 0,
          fontSize: "50px",
          background: " rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
        }}
      >
        <VerticalAlignTopOutlined style={{ color: "white" }} />
      </span>
    </div>
  );
};

export default goBack;
