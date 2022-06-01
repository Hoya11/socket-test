const httpMocks = require("node-mocks-http");
const voiceAlbumController = require("../controllers/voiceAlbumController");
const voiceAlbumSchemas = require("../schemas/voiceAlbum");
// const voiceParams = require("./data/voice-params.json");
const voiceAlbumBody = require("./data/voiceAlbum-body.json");
const userLocals = require("./data/user-local.json");
// const voiceAlbumId = require("./data/voiceAlbumId.json");
const User = require("../schemas/user");

jest.mock("../schemas/user");

voiceAlbumSchemas.create = jest.fn();
// let req, res, next;

// const userId = res.locals.user;

// beforeEach(() => {
//   req = httpMocks.createRequest();
//   res = httpMocks.createResponse();
//   next = jest.fn();
// });

describe("Voice Album", () => {
  //   // const res = {
  //   //   status: jest.fn(() => res),
  //   //   send: jest.fn(),
  //   // };

  //   beforeEach(() => {
  //     // req.params = voiceParams;
  //     req.body = voiceAlbumBody;
  //     res.locals.user = userLocals;
  //   });
  //   // console.log(11, userLocals);

  //   it("voiceAlbum Create function", () => {
  //     expect(typeof voiceAlbumController.createVoiceAlbum).toBe("function");
  //   });

  //   it("보이스앨범 생성 작동확인", async () => {
  //     const req = httpMocks.createRequest({
  //       method: "POST",
  //       url: "/voiceAlbum/familyId",
  //       params: {
  //         familyId: "5555",
  //       },
  //       // body: {
  //       //   voiceAlbumCover: "test11",
  //       //   voiceAlbumName: "test22",
  //       // },
  //     });
  //     await User.findOne.mockReturnValue({
  //       userLocals,
  //     });

  //     await voiceAlbumController.createVoiceAlbum(req, res, next);
  //     expect(voiceAlbumSchemas.create).toBeCalledTimes(1);
  //     // expect(res._isJSON()).toBeTruthy();
  //     // console.log(444, res.voiceAlbumId);
  //     // console.log(555, voiceAlbumBody);
  //   });

  it("보이스앨범 생성 작동확인22", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/voiceAlbum/familyId",
      params: {
        familyId: "5555",
      },
      // body: {
      //   voiceAlbumCover: "test11",
      //   voiceAlbumName: "test22",
      // },
    });
    const res = httpMocks.createResponse({
      locals: {
        userId: "1234",
      },
    });
    const next = jest.fn();
    await User.findOne.mockReturnValue({
      userId: res.locals,
    });
    await voiceAlbumController.createVoiceAlbum(req, res, next);
    // await voiceAlbumSchemas.create.mockReturnValue(voiceAlbumBody);
    // expect(res).toBe(201);
    // expect(voiceAlbumSchemas.create).toBeCalledWith(voiceAlbumId);
    expect(voiceAlbumSchemas.create).toBeCalledTimes(1);
    // expect(res._isJSON()).toBeTruthy();
    // console.log(444, res.voiceAlbumId);
    // console.log(555, voiceAlbumBody);
  });

  // it("보이스앨범 생성 201 response", async () => {
  //   await voiceAlbumController.createVoiceAlbum(req, res, next);
  //   expect(res.statusCode).toBe(201);
  //   expect(res._isJSON()).toBeTruthy();
  // });

  // it("보이스앨범 res, Json body", async () => {
  //   await voiceAlbumSchemas.create.mockReturnValue(voiceAlbumBody);
  //   await voiceAlbumController.createVoiceAlbum(req, res, next);
  //   expect(res._getJSONData()).toStrictEqual(voiceAlbumBody);
  // });

  // it("error handle", async () => {
  //   const errorMessage = { message: "에러메세지 테스트임" };
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   voiceAlbumSchemas.create.mockReturnValue(rejectedPromise);
  //   await voiceAlbumController.createVoiceAlbum(req, res, next);
  //   expect(next).toBeCalledWith(errorMessage);
  // });
});
