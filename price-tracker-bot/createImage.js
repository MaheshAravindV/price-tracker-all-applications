const { Chart } = require("chart.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const width = 400;
const height = 400;

Date.prototype.nextDay = function () {
  this.setDate(this.getDate() + 1);
  return (
    this.getDate() + "/" + (this.getMonth() + 1) + "/" + this.getFullYear()
  );
};

const chartCallback = (ChartJS) => {
  ChartJS.register({
    id: "custom_canvas_background_color",
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext("2d");
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  });
};

async function createImage(item) {
  const prices = [];
  const dates = [];
  let cur = new Date(item.start_date);
  item.history.forEach((price) => {
    dates.push(cur.nextDay());
    prices.push(price);
  });
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback,
  });
  const configuration = {
    type: "line",
    data: {
      labels: [...dates],
      datasets: [
        {
          label: "Price",
          borderColor: "#ff0000",
          backgroundColor: "#ffffff",
          data: [...prices],
        },
      ],
    },
    scaleGridLineColor: "rgba(0,0,0,0)",
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  };

  const image = chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}

module.exports = createImage;
