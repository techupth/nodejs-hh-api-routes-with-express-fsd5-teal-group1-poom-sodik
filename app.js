// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsPost = [...assignments];
let commentsPost = [...comments];

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  let limit;
  req.query.limit ? (limit = Number(req.query.limit)) : (limit = 10);

  if (limit > 10) {
    return res.json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentsLimit = assignmentsPost.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsLimit,
  });
});
app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentData = assignmentsPost.filter(
    (item) => item.id === assignmentIdFromClient
  );
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});
app.post("/assignments", (req, res) => {
  assignmentsPost.push({
    id: assignmentsPost[assignmentsPost.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
    body: req.body,
  });
});
app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let newData = assignmentsPost.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  if (newData.length === assignmentsPost.length) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  assignmentsPost = newData;
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});
app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let newDataIndex = assignmentsPost.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (newDataIndex !== -1) {
    assignmentsPost[newDataIndex].title = req.body.title;
    assignmentsPost[newDataIndex].categories = req.body.categories;
    assignmentsPost[newDataIndex].description = req.body.description;
  } else {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    body: assignmentsPost[newDataIndex],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
