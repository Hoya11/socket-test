const httpMocks = require("node-mocks-http");
const authMiddleware = require("../middlewares/authMiddleware");
const { faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

jest.mock("jsonwebtoken");
jest.mock("../schemas/user");

describe("계산 테스트", () => {
  const a = 1,
    b = 2;

  test("a + b는 3이다.", () => {
    expect(a + b).toEqual(3);
  });
});

describe("Auth Middleware", () => {
  // it("returns 401 for the request without Authorization header", async () => {
  //   const request = httpMocks.createRequest({
  //     method: "GET",
  //     url: "/mission",
  //   });
  //   const response = httpMocks.createResponse();
  //   const next = jest.fn();
  //   await authMiddleware(request, response, next);
  //   expect(response.statusCode).toBe(401);
  //   expect(next).not.toBeCalled();
  // });
  // it("returns 401 for the request with unsupported Authorization header", async () => {
  //   const request = httpMocks.createRequest({
  //     method: "GET",
  //     url: "/mission",
  //     headers: { Authorization: "Basic" },
  //   });
  //   const response = httpMocks.createResponse();
  //   const next = jest.fn();
  //   await authMiddleware(request, response, next);
  //   expect(response.statusCode).toBe(401);
  //   expect(next).not.toBeCalled();
  // });
  // it("returns 401 for the request with invalid JWT", async () => {
  //   const tokenValue = faker.random.alphaNumeric(128);
  //   const request = httpMocks.createRequest({
  //     method: "GET",
  //     url: "/mission",
  //     headers: { Authorization: `Bearer ${tokenValue}` },
  //   });
  //   const response = httpMocks.createResponse();
  //   const next = jest.fn();
  //   jwt.verify = jest.fn((tokenValue, secret, callback) => {
  //     callback(new Error("bad token"), undefined);
  //   });
  //   await authMiddleware(request, response, next);
  //   expect(response.statusCode).toBe(401);
  //   expect(next).not.toBeCalled();
  // });
  // it("returns 401 when cannot find a user by email from the JWT", async () => {
  //   const tokenValue = faker.random.alphaNumeric(128);
  //   const email = faker.internet.email();
  //   const request = httpMocks.createRequest({
  //     method: "GET",
  //     url: "/mission",
  //     headers: { Authorization: `Bearer ${tokenValue}` },
  //   });
  //   const response = httpMocks.createResponse();
  //   const next = jest.fn();
  //   jwt.verify = jest.fn((tokenValue, secret, callback) => {
  //     callback(undefined, { email });
  //   });
  //   User.findOne = jest.fn((email) => Promise.resolve(undefined));
  //   await authMiddleware(request, response, next);
  //   expect(response.statusCode).toBe(401);
  //   expect(next).not.toBeCalled();
  // });
  // it("passes a request with valid Authorization header with token", async () => {
  //   const tokenValue = faker.random.alphaNumeric(128);
  //   const email = faker.internet.email();
  //   const request = httpMocks.createRequest({
  //     method: "GET",
  //     url: "/mission",
  //     headers: { Authorization: `Bearer ${tokenValue}` },
  //   });
  //   const response = httpMocks.createResponse();
  //   const next = jest.fn();
  //   jwt.verify = jest.fn((tokenValue, secret, callback) => {
  //     callback(undefined, { email });
  //   });
  //   User.findOne = jest.fn((email) => Promise.resolve({ email }));
  //   await authMiddleware(request, response, next);
  //   expect(response.locals.user).toMatchObject({ user });
  //   expect(next).toHaveBeenCalledTimes(1);
  // });
});
