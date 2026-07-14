import * as d3 from "d3";

export const Tooltip = (className) => {
  const removeTooltips = () => {
    const elements = document.getElementsByClassName(`${className}`);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };
  removeTooltips();

  return d3.select("body").append("div").attr("class", `tooltip ${className}`);
};
