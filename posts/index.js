const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan')


const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'))
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  console.log("#######################GET: POSTS##################")
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  console.log("CREATE: POSTS")
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title
  };

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('POSTS: Received Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('Posts : Listening on 4000');
});
