import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock database for development since Firebase setup failed
  let ontologies: any[] = [
    {
      id: "ont-001",
      name: "Default Ontology",
      status: "published",
      owner_id: "admin",
      latest_published_version: "v1.0"
    }
  ];

  let objectTypes: any[] = [
    {
      id: "ot-001",
      ontology_id: "ont-001",
      api_name: "User",
      display_name: "用户",
      description: "系统内部用户对象",
      primary_key: "id",
      status: "active"
    },
    {
      id: "ot-002",
      ontology_id: "ont-001",
      api_name: "Order",
      display_name: "订单",
      description: "电子商务订单记录",
      primary_key: "orderId",
      status: "active"
    }
  ];

  let properties: any[] = [
    { id: "prop-001", owner_id: "ot-001", api_name: "id", display_name: "ID", data_type: "string", required: true },
    { id: "prop-002", owner_id: "ot-001", api_name: "username", display_name: "用户名", data_type: "string", required: true },
    { id: "prop-003", owner_id: "ot-002", api_name: "orderId", display_name: "订单号", data_type: "string", required: true },
    { id: "prop-004", owner_id: "ot-002", api_name: "amount", display_name: "金额", data_type: "double", required: true }
  ];

  let linkTypes: any[] = [
    {
      id: "lt-001",
      ontology_id: "ont-001",
      api_name: "userOrders",
      display_name: "用户关联订单",
      source_object_type_id: "ot-001",
      target_object_type_id: "ot-002",
      cardinality: "one_to_many"
    }
  ];

  let versions: any[] = [
    {
      id: "v-001",
      ontology_id: "ont-001",
      version: "v1.0",
      status: "published",
      changelog: "初始版本",
      created_at: "2026-04-22T08:00:00Z"
    }
  ];

  app.get("/api/ontologies", (req, res) => {
    res.json(ontologies);
  });

  app.post("/api/ontologies", (req, res) => {
    const newOntology = {
      id: `ont-${Date.now()}`,
      ...req.body,
      status: "draft",
      owner_id: "current-user"
    };
    ontologies.push(newOntology);
    res.status(201).json(newOntology);
  });

  app.get("/api/ontologies/:id/object-types", (req, res) => {
    res.json(objectTypes.filter(ot => ot.ontology_id === req.params.id));
  });

  app.post("/api/ontologies/:id/object-types", (req, res) => {
    const newOT = {
      id: `ot-${Date.now()}`,
      ontology_id: req.params.id,
      api_name: req.body.api_name || "NewObject",
      display_name: req.body.display_name || "新对象",
      description: "",
      primary_key: "",
      status: "draft"
    };
    objectTypes.push(newOT);
    res.status(201).json(newOT);
  });

  app.get("/api/object-types/:id", (req, res) => {
    const ot = objectTypes.find(o => o.id === req.params.id);
    if (!ot) return res.status(404).send();
    res.json(ot);
  });

  app.patch("/api/object-types/:id", (req, res) => {
    const index = objectTypes.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).send();
    objectTypes[index] = { ...objectTypes[index], ...req.body };
    res.json(objectTypes[index]);
  });

  app.delete("/api/object-types/:id", (req, res) => {
    objectTypes = objectTypes.filter(o => o.id !== req.params.id);
    properties = properties.filter(p => p.owner_id !== req.params.id);
    res.status(204).send();
  });

  app.get("/api/object-types/:id/properties", (req, res) => {
    res.json(properties.filter(p => p.owner_id === req.params.id));
  });

  app.post("/api/object-types/:id/properties", (req, res) => {
    const newProp = {
      id: `prop-${Date.now()}`,
      owner_id: req.params.id,
      api_name: req.body.api_name || "newProperty",
      display_name: req.body.display_name || "新属性",
      data_type: req.body.data_type || "string",
      required: false
    };
    properties.push(newProp);
    res.status(201).json(newProp);
  });

  app.patch("/api/properties/:id", (req, res) => {
    const index = properties.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).send();
    properties[index] = { ...properties[index], ...req.body };
    res.json(properties[index]);
  });

  app.delete("/api/properties/:id", (req, res) => {
    properties = properties.filter(p => p.id !== req.params.id);
    res.status(204).send();
  });

  app.get("/api/ontologies/:id/link-types", (req, res) => {
    res.json(linkTypes.filter(lt => lt.ontology_id === req.params.id));
  });

  app.post("/api/ontologies/:id/link-types", (req, res) => {
    const newLT = {
      id: `lt-${Date.now()}`,
      ontology_id: req.params.id,
      api_name: req.body.api_name || "newLink",
      display_name: req.body.display_name || "新链接",
      source_object_type_id: req.body.source_object_type_id || "",
      target_object_type_id: req.body.target_object_type_id || "",
      cardinality: req.body.cardinality || "one_to_many"
    };
    linkTypes.push(newLT);
    res.status(201).json(newLT);
  });

  app.patch("/api/link-types/:id", (req, res) => {
    const index = linkTypes.findIndex(l => l.id === req.params.id);
    if (index === -1) return res.status(404).send();
    linkTypes[index] = { ...linkTypes[index], ...req.body };
    res.json(linkTypes[index]);
  });

  app.delete("/api/link-types/:id", (req, res) => {
    linkTypes = linkTypes.filter(l => l.id !== req.params.id);
    res.status(204).send();
  });

  app.post("/api/object-types/:id/properties", (req, res) => {
    const newProp = {
      id: `prop-${Date.now()}`,
      owner_id: req.params.id,
      api_name: req.body.api_name || "new_property",
      display_name: req.body.display_name || "新属性",
      data_type: req.body.data_type || "string",
      required: false
    };
    properties.push(newProp);
    res.status(201).json(newProp);
  });

  app.get("/api/ontologies/:id/versions", (req, res) => {
    res.json(versions.filter(v => v.ontology_id === req.params.id));
  });

  app.get("/api/ontologies/:id/validation-results", (req, res) => {
    const results = [];
    
    // Simple mock validation logic
    const ots = objectTypes.filter(ot => ot.ontology_id === req.params.id);
    ots.forEach(ot => {
      if (!ot.primary_key) {
        results.push({
          id: `val-${Date.now()}-${ot.id}`,
          severity: "error",
          code: "MISSING_PRIMARY_KEY",
          message: `对象类型 "${ot.display_name}" 缺失主键定义`,
          target_ref: `object-type:${ot.id}`
        });
      }
    });

    const lts = linkTypes.filter(lt => lt.ontology_id === req.params.id);
    lts.forEach(lt => {
      if (!lt.source_object_type_id || !lt.target_object_type_id) {
        results.push({
          id: `val-${Date.now()}-${lt.id}`,
          severity: "error",
          code: "INCOMPLETE_LINK",
          message: `链接类型 "${lt.display_name}" 配置不完整`,
          target_ref: `link-type:${lt.id}`
        });
      }
    });

    res.json(results);
  });

  // --- Query & Analysis Console State ---
  let queryEvents: any[] = [
    {
      id: "qe-001",
      occurred_at: "2026-04-28T07:00:00Z",
      query_type: "filter",
      source_app: "Workshop",
      duration_ms: 120,
      status: "success",
      ontology_id: "ont-001",
      result_count: 50
    },
    {
      id: "qe-002",
      occurred_at: "2026-04-28T07:15:00Z",
      query_type: "search",
      source_app: "Object Explorer",
      duration_ms: 2500,
      status: "success",
      ontology_id: "ont-001",
      result_count: 15200
    }
  ];

  app.get("/api/query-events", (req, res) => {
    res.json(queryEvents);
  });

  app.get("/api/query-events/:id/explain", (req, res) => {
    res.json({
      queryEventId: req.params.id,
      schemaVersion: "v1.4",
      summary: "从 Customer 出发，经过 Orders 与 Payments 两段关系，结果集在第二跳显著膨胀",
      filters: [
        { field: "Customer.region", operator: "=", value: "APAC" }
      ],
      path: [
        { hop: 1, from: "Customer", link: "places", to: "Order" },
        { hop: 2, from: "Order", link: "paid_by", to: "Payment" }
      ],
      resultCount: 18324,
      durationMs: 2410,
      riskHints: ["第二跳结果集膨胀", "过滤条件过晚应用"]
    });
  });

  app.get("/api/analysis/hotspots", (req, res) => {
    res.json([
      { entity_type: "object-type", entity_ref: "User", frequency: 1500, avg_cost: 0.5 },
      { entity_type: "object-type", entity_ref: "Order", frequency: 800, avg_cost: 1.2 },
      { entity_type: "link-type", entity_ref: "userOrders", frequency: 1200, avg_cost: 0.8 }
    ]);
  });

  app.post("/api/analysis/impact", (req, res) => {
    res.json([
      { source_ref: req.body.sourceRef, target_type: "query", target_ref: "UserOrdersQuery", impact_level: "direct" },
      { source_ref: req.body.sourceRef, target_type: "page", target_ref: "UserDetailView", impact_level: "indirect" },
      { source_ref: req.body.sourceRef, target_type: "action", target_ref: "SubmitOrder", impact_level: "potential" }
    ]);
  });

  app.get("/api/graph/explore", (req, res) => {
    // Basic mock graph expansion
    res.json({
      nodes: [
        { id: "User:1", type: "User", label: "Admin User", props: { username: "admin" } },
        { id: "Order:101", type: "Order", label: "ORD-101", props: { amount: 500 } },
        { id: "Order:102", type: "Order", label: "ORD-102", props: { amount: 1200 } }
      ],
      edges: [
        { id: "e1", source: "User:1", target: "Order:101", label: "userOrders" },
        { id: "e2", source: "User:1", target: "Order:102", label: "userOrders" }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
