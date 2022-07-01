require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
      const tasks = await tasksCollection
        .find({ isCompleted: false })
        .toArray();
      res.send(tasks);
    });

    // displaying completed tasks
    app.get('/completedTasks', async (req, res) => {
      const completedTasks = await tasksCollection
        .find({ isCompleted: true })
        .toArray();
      res.send(completedTasks);
    });

    // displaying todo tasks based on date
    app.get('/tasks/lists', async (req, res) => {
      const date = req.query.date;
      console.log(date);
      const tasks = await tasksCollection
        .find({
          $and: [{ isCompleted: { $eq: false } }, { taskDate: { $eq: date } }],
        })
        .toArray();
      // console.log(res);
      console.log(tasks);
      res.send(tasks);
    });

    // displaying completed tasks
    app.get('/completedTasks/lists', async (req, res) => {
      const date = req.query.date;
      const completedTasks = await tasksCollection
        .find({
          $and: [{ isCompleted: { $eq: true } }, { taskDate: { $eq: date } }],
        })
        .toArray();
      console.log(res);
      // console.log(completedTasks);
      res.send(completedTasks);
    });

    //  adding tasks
    app.post('/tasks', async (req, res) => {
      const taskAdding = await tasksCollection.insertOne(req.body);
      res.send(taskAdding);
    });

    // update taskDetails by completing tasks
    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const updateTaskList = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const tasksUpdate = {
        $set: {
          taskName: updateTaskList?.taskName,
          taskDate: updateTaskList?.taskDate,
          isCompleted: true,
        },
      };
      const tasksUpdateResult = await tasksCollection.updateOne(
        filter,
        tasksUpdate,
        options
      );
      res.send(tasksUpdateResult);
    });

    // update taskDetails by not completing tasks
    app.put('/completedTasks/:id', async (req, res) => {
      const id = req.params.id;
      const updateTaskList = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const tasksUpdate = {
        $set: {
          taskName: updateTaskList?.taskName,
          taskDate: updateTaskList?.taskDate,
          isCompleted: false,
        },
      };
      const tasksUpdateResult = await tasksCollection.updateOne(
        filter,
        tasksUpdate,
        options
      );
      res.send(tasksUpdateResult);
    });

    // update taskDetails by completing tasks
    app.patch('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      // const updateTaskList = req.body;
      const filter = { _id: ObjectId(id) };
      // const options = { upsert: true };
      const tasksUpdate = {
        $set: {
          // taskName: updateTaskList?.taskName,
          // taskDate: updateTaskList?.taskDate,
          isCompleted: true,
        },
      };
      const tasksUpdateResult = await tasksCollection.updateOne(
        filter,
        tasksUpdate
        // options
      );
      res.send(tasksUpdateResult);
    });

    // update taskDetails by not completing tasks
    app.patch('/completedTasks/:id', async (req, res) => {
      const id = req.params.id;
      // const updateTaskList = req.body;
      const filter = { _id: ObjectId(id) };
      // const options = { upsert: true };
      const tasksUpdate = {
        $set: {
          // taskName: updateTaskList?.taskName,
          // taskDate: updateTaskList?.taskDate,
          isCompleted: false,
        },
      };
      const tasksUpdateResult = await tasksCollection.updateOne(
        filter,
        tasksUpdate
        // options
      );
      res.send(tasksUpdateResult);
    });

    // delete task by id
    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await tasksCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
