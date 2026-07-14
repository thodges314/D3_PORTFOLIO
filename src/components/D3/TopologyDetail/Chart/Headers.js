import * as d3 from "d3";

export const Headers = (table) => {
  const tableHeaders = table.append("tr");
  tableHeaders.append("th").text("Topology Name");
  tableHeaders.append("th").text("BAU Investment");
  tableHeaders.append("th").text("Optimal Investment");
  tableHeaders.append("th").text("Difference in Investment");
};
