import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {
  const newAssignments = {
    title: null,
    content: null,
    category: null,
    length: null,
    status: null,
    ...req.body,
    published_at: new Date(),
  };
  for (const key in newAssignments) {
    if (!newAssignments[key]) {
      return res.status(400).json({
        message:
          "Server could not create assignment because there are missing data from client",
      });
    }
  }

  try {
    await connectionPool.query(
      `insert into assignments (user_id,title,content,category,length,status,published_at) 
      values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        1,
        newAssignments.title,
        newAssignments.content,
        newAssignments.category,
        newAssignments.length,
        newAssignments.status,
        newAssignments.published_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not create assignment because database connection",
    });
  }

  return res.status(201).json({
    message: "Created assignment sucessfully",
  });
});

app.get("/assignments", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(`select * from assignments`);
  } catch (error) {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

app.get("/assignments/:assignmentId", async (req, res) => {
  const assignmentId = req.params.assignmentId;
  let result;
  try {
    result = await connectionPool.query(
      `select * from assignments where assignment_id = $1`,
      [assignmentId]
    );
  } catch (error) {
    return res.status(500).json({
      message: `Server could not read assignment = ${assignmentId} because database connection`,
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: `Server could not find a requested assignment = ${assignmentId}`,
    });
  }

  return res.status(200).json({
    data: result.rows[0],
  });
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentId = req.params.assignmentId;
  const updatedAssignmentId = { ...req.body, updated_at: new Date() };
  let result;
  try {
    result = await connectionPool.query(
      `update assignments set title = $2,content = $3,category =$4,length = $5,status =$6,updated_at =$7 where assignment_id = $1 `,
      [
        assignmentId,
        updatedAssignmentId.title,
        updatedAssignmentId.content,
        updatedAssignmentId.category,
        updatedAssignmentId.length,
        updatedAssignmentId.status,
        updatedAssignmentId.updated_at,
      ]
    );
  } catch (error) {
    return res.status(500).json({
      message: `Server could not update assignment = ${assignmentId} because database connection`,
    });
  }

  if (result.rowCount == 0) {
    return res.status(404).json({
      message: `Server could not find a requested assignment = ${assignmentId}`,
    });
  }

  return res.status(200).json({
    message: "Updated assignment sucessfully",
  });
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentId = req.params.assignmentId;
  let result;
  try {
    result = await connectionPool.query(
      `delete from assignments where assignment_id = $1`,
      [assignmentId]
    );
  } catch (error) {
    return res.status(500).json({
      message: `Server could not delete assignment = ${assignmentId} because database connection`,
    });
  }

  if (result.rowCount == 0) {
    return res.status(404).json({
      message: `Server could not find a requested assignment = ${assignmentId}`,
    });
  }

  return res.status(200).json({
    message: "Deleted assignment sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
