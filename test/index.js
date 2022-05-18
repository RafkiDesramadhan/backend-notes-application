const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");

chai.use(chaiHttp);

describe("API ENDPOINT TESTING", () => {
  it("Test Register", (done) => {
    const dataSample = {
      username: "budi123",
      password: "123456",
      confPassword: "123456",
    };
    chai
      .request(app)
      .post("/api/v1/register")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("username", dataSample.username)
      .field("password", dataSample.password)
      .field("confPassword", dataSample.confPassword)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("msg");
        expect(res.body.msg).to.equal("User success created!");
        expect(res.body).to.have.property("status");
        expect(res.body.status).to.equal("success");
      });
    done();
  });

  it("Test Login", (done) => {
    const dateSample = {
      username: "rafki23",
      password: "123456",
    };
    chai
      .request(app)
      .post("/api/v1/login")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("username", dateSample.username)
      .field("password", dateSample.password)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status");
        expect(res.body.status).to.equal("success");
        expect(res.body).to.have.property("accessToken");
      });
    done();
  });
});
