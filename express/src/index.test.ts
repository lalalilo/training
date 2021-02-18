import request from "supertest";

const server = require("./index");

describe("testing-server", function () {
  it("Get /people - sucess", async () => {
    const { body } = await request(server).get("/people");
    expect(body).toEqual(["Anais", "Kenzo", "Fabien"]);
  });
  it("Post /people - sucess", async () => {
    const { body } = await request(server)
      .post("/people")
      .send({ Lalilian: "Ambre" });
    expect(body).toEqual(["Anais", "Kenzo", "Fabien", "Ambre"]);
  });
});
