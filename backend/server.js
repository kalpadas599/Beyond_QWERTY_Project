const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api", aiRoutes);

// Load Swagger Docs
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
