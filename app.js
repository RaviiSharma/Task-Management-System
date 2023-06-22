const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL Connection Configuration
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
   //password:"Ravi@036",
    database: "exceldb",
  });

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database!');
});

// Middleware
app.use(bodyParser.json());

// ______________/ Routes /________________
// Get all tasks
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('An error occurred while fetching tasks.');
    } else {
      res.json(results);
    }
  });
});

// Create a task
app.post('/tasks', (req, res) => {
  const { title, description, priority, due_date, assigned_to } = req.body;
  const query = 'INSERT INTO tasks (title, description, priority, due_date, assigned_to) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [title, description, priority, due_date, assigned_to], (err, results) => {
    if (err) {
      res.status(500).send('An error occurred while creating the task.');
    } else {
      res.status(201).send('Task created successfully.');
    }
  });
});

// Update a task
app.put('/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;
    const { title, description, priority, due_date, assigned_to } = req.body;
    let updates = [];
    let updateParams = [];
  
    if (title) {
      updates.push('title = ?');
      updateParams.push(title);
    }
  
    if (description) {
      updates.push('description = ?');
      updateParams.push(description);
    }
  
    if (priority) {
      updates.push('priority = ?');
      updateParams.push(priority);
    }
  
    if (due_date) {
      updates.push('due_date = ?');
      updateParams.push(due_date);
    }
  
    if (assigned_to) {
      updates.push('assigned_to = ?');
      updateParams.push(assigned_to);
    }
  
    if (updates.length === 0) {
      res.status(400).send('No fields to update.');
      return;
    }
  
    const updateString = updates.join(', ');
    const query = `UPDATE tasks SET ${updateString} WHERE id = ?`;
    updateParams.push(taskId);
  
    db.query(query, updateParams, (err, results) => {
      if (err) {
        res.status(500).send('An error occurred while updating the task.');
      } else {
        res.send('Task updated successfully.');
      }
    });
  });
  

// Delete a task
app.delete('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [taskId], (err, results) => {
    if (err) {
      res.status(500).send('An error occurred while deleting the task.');
    } else {
      res.send('Task deleted successfully.');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
