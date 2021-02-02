const app = require("./server");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EXPRESS SERVER PORT: ${PORT}`);
});
