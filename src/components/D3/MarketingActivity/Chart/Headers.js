import * as d3 from "d3";

export const Headers = (table) => {
    const tableHeaders = table.append("tr");
    tableHeaders.append("th").text("");
    tableHeaders.append("th").text("Investment");
    tableHeaders.append("th").text("Touches");
    tableHeaders.append("th").text("Conversions");
};
