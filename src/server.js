const { app } = require("./app");

const PORT = process.env.PORT || 3000;

// starting listening the port
app.listen(PORT, () => {
  console.log(`Server is running. Start listening port ${PORT}...`);
});
