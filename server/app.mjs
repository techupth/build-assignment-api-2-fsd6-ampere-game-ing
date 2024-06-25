import express from "express";
import connectionPool from "./utils/db.mjs";


const app = express();
const port = 4003;

app.use(express.json());

//--------------Get:Id-------------//
app.get("/assignments/:assignmentId",async (req, res)=>{
  const assignmentFormClient = req.params.assignmentId;
  let result 
  try {
  result = await connectionPool.query(
    `select * from assignments where assignment_id=$1`,[assignmentFormClient]
  );
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection" 
    });
  }

  if(!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested assignment" 
    });
  }
  return res.status(200).json({  
      data: result.rows[0]    
  });
});
//--------------Get-------------//
app.get("/assignments",async (req, res)=>{
  
  let result
  try{
   result = await connectionPool.query(`select * from assignments`);
  } catch {
    return res.status(500).json({    
      message: "Server could not read assignment because database connection" 
});
  }
  
return res.status(200).json({    
  data: result.rows,    
});
})
//--------------Update--------------//
app.put("/assignments/:assignmentId", async (req,res)=>{
  const assignmentFormClient = req.params.assignmentId;
  const updatedassignment = {...req.body, updated_at:new Date()}
let result
  try{  
  result = await connectionPool.query(
  `
  update assignments
  set title = $2,
      content =$3,
      category =$4,
      updated_at =$5
  where assignment_id=$1
  `,
  [
    assignmentFormClient,
    updatedassignment.title,
    updatedassignment.content,
    updatedassignment.category,
    updatedassignment.updated_at,
  ]
);

console.log(result)
if(result.rowCount==0) {
  return res.status(404).json({
    message: "Server could not find a requested assignment to update"
  });
}
return res.status(200).json({    
  message: "Updated assignment sucessfully" 
});

} catch (error) {
    return res.status(500).json({
      message: "Server could not update assignment because database connection" 
    })
}

}) 
//-----------DELETE--------//
app.delete("/assignments/:assignmentId", async (req,res)=>{
  const assignmentFormClient = req.params.assignmentId;
 let result
  try{  
  result = await connectionPool.query(
  `
  delete from assignments
    where assignment_id=$1
  `,[assignmentFormClient]  
);

console.log(result)
if(result.rowCount==0) {
  return res.status(404).json({
    message: "Server could not find a requested assignment to delete" 
  });
}
return res.status(200).json({    
  message: "Deleted assignment sucessfully" 
});

} catch (error) {
    return res.status(500).json({
      message: "Server could not delete assignment because database connection" 
    })
}
});

//------------------------------//

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
