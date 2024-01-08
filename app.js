// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";
let mockAssignments = [...assignments];
let mockComments = [...comments];
const app = express();
const port = 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", function (req, res) {
  let limit;
  req.query.limit ? (limit = Number(req.query.limit)) : (limit = 10);
  if (limit > 10) {
    return res.json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const limitMockAssignments = mockAssignments.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: limitMockAssignments,
  });
});

app.get("/assignments/:assignmentsId", function (req, res) {
  const clientAssignmentsId = Number(req.params.assignmentsId);
  const assignmentData = mockAssignments.filter((item) => {
    return item.id === clientAssignmentsId;
  });
  if (assignmentData.length === 0) {
    return res.json({
      message: "Cannot fectch, No data available!",
    });
  }
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.get("/assignments/:assignmentsId/comments", function (req, res) {
  const clientAssignmentsId = Number(req.params.assignmentsId);
  const commentsData = mockComments.filter((item) => {
    return item.assignmentId === clientAssignmentsId;
  });
  if (commentsData.length === 0) {
    return res.json({
      message: "Cannot fectch, No data available!",
    });
  }

  return res.json({
    message: "Complete fetching comments",
    data: commentsData,
  });
});

app.post("/assignments", function (req, res) {
  const { title, description, categories } = req.body;
  if (!title || !description || !categories) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newAssingments = {
    id: mockAssignments[mockAssignments.length - 1].id + 1,
    title,
    description,
    categories,
  };
  mockAssignments.push(newAssingments);
  return res.json({
    message: "New assignment has been created successfully",
    data: newAssingments,
  });
});

app.post("/assignments/:assignmentsId/comments", function (req, res) {
  const clientAssignmentsId = Number(req.params.assignmentsId);
  const { content } = req.body;
  if (!clientAssignmentsId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newComments = {
    id: mockComments[mockComments.length - 1].id + 1,
    assignmentId: clientAssignmentsId,
    content,
  };
  mockComments.push(newComments);
  return res.json({
    message: "Complete fetching comments",
    data: newComments,
  });
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  const clientAssignmentsId = Number(req.params.assignmentsId);
  const assignmentsIndex = mockAssignments.findIndex((item) => {
    return item.id === clientAssignmentsId;
  });
  const newAssignmentsData = mockAssignments.filter((item) => {
    return item.id !== clientAssignmentsId;
  });
  if (assignmentsIndex === -1) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }
  mockAssignments = newAssignmentsData;
  return res.json({
    message: "Assignment has been deleted successfully",
  });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  const clientAssignmentsId = Number(req.params.assignmentsId);
  const { title, description, categories } = req.body;
  if (!title || !description || !categories) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const assignmentsIndex = mockAssignments.findIndex((item) => {
    return item.id === clientAssignmentsId;
  });
  if (assignmentsIndex !== -1) {
    mockAssignments[assignmentsIndex] = {
      id: clientAssignmentsId,
      title,
      description,
      categories,
    };
    return res.json({
      message: "This assignment has been updated successfully",
      data: mockAssignments[assignmentsIndex],
    });
  } else {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
