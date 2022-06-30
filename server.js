require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

// middleware
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(express.json());

// displaying default message
app.get('/', (req, res) => {
  res.send('HELLO THERE!!');
});

// Connecting database
const uri = `mongodb+srv://${process.env.AUTHOR}:${process.env.PASSWORD}@cluster0.p4smn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const tasksCollection = client.db('tasksLists').collection('tasks');

    // displaying  tasks
    app.get('/tasks', async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.send(tasks);
    });

    //  adding tasks
    app.post('/tasks', async (req, res) => {
      const completeTask = {
        $set: { isCompleted: false },
      };
      const taskAdding = await tasksCollection.insertOne(
        req.body,
        completeTask
      );
      res.send(taskAdding);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
