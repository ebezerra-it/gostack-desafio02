const express = require("express");
const cors = require("cors");
const Repository = require('./repository');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (repositories.length === 0) {  
    return response.status(404).json({ message: 'No repository found.'});
  } 
  
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { id, title, url, techs } = request.body;
  const repository = new Repository({ id, title, url, techs });

  if (!repository.validate()) {
    return response.status(400).json({ 
      message: 'Invalid arguments.',
      repository
    });
  }

  repositories.push(repository);
  return response.status(200).json( 
    repository.toJSON()
  );
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repository = repositories.find(repo => repo.id() === id);

  if (repository === undefined) {
    return response.status(400).json({ 
      message: 'Invalid arguments.',
      repository
    });
  }
  
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  if (!repository.validate()) {
    return response.status(400).json( 
      repository
    );
  }

  return response.status(200).json( 
    repository.toJSON()
  );
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex= repositories.findIndex(repo => repo.id() === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ 
      message: 'Invalid arguments.',
      repository
    });
  }
  
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id() === id);

  if (repository === undefined) {
    return response.status(400).json({ 
      message: 'Invalid arguments.',
      repository
    });
  }

  repository.like();
  response.status(200).json( 
    repository
  );
});

module.exports = app;
