import bodyParser from "body-parser";
import express from "express";

let jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.json());

let Lalilians = ["Anais", "Kenzo", "Fabien"];

const validatePost = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let LalilianValue = req.body.Lalilian;
  if (LalilianValue === 0) {
    return res.status(500).send({
      error: "No Lalilian value",
    });
  }

  next();
};

app.post(
  "/people",
  validatePost,
  (req: express.Request, res: express.Response) => {
    Lalilians.push(req.body.Lalilian);
    res.send(Lalilians);
  }
);

const authentification = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  var token = req.query.token;
  jwt.verify(
    token,
    "supersecret",
    (err: express.ErrorRequestHandler, decoded: any) => {
      if (!err) {
        next();
      } else {
        res.send(err);
      }
    }
  );
  next();
};

app.get(
  "/people",
  authentification,
  (req: express.Request, res: express.Response) => {
    res.send(Lalilians);
  }
);

app.get("/token", (req: express.Request, res: express.Response) => {
  var token = jwt.sign(
    { username: "lalilianThatHaveAuthorization" },
    "supersecret",
    { expiresIn: 120 }
  );
  res.send(token);
});

app.get("/api", (req: express.Request, res: express.Response) => {});

module.exports = app.listen(5000);
