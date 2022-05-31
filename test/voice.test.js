const httpMocks = require("node-mocks-http");
const voiceAlbumController = require("../controllers/voiceAlbumController");
const voiceAlbumSchemas = require("../schemas/voiceAlbum");
const voiceParams = require("./data/voice-params.json");
const voiceAlbumBody = require("./data/voiceAlbum-body.json");
const userLocals = require("./data/user-local.json");
const voiceAlbum = require("../schemas/voiceAlbum");

voiceAlbumSchemas.create = jest.fn();
let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe("Voice Album", () => {
  beforeEach(() => {
    req.params = voiceParams;
    req.body = voiceAlbumBody;
    res.locals.user = userLocals;
  });

  it("voiceAlbum Create function", () => {
    expect(typeof voiceAlbumController.createVoiceAlbum).toBe("function");
  });

  it("보이스앨범 생성 작동확인", async () => {
    await voiceAlbumController.createVoiceAlbum(req, res, next);
    expect(voiceAlbumSchemas.create).toBeCalledWith(
      voiceParams,
      userLocals,
      voiceAlbumBody
    );
  });

  it("보이스앨범 생성 201 response", async () => {
    await voiceAlbumController.createVoiceAlbum(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isJSON()).toBeTruthy();
  });

  it("보이스앨범 res, Json body", async () => {
    await voiceAlbumSchemas.create.mockReturnValue(voiceAlbumBody);
    await voiceAlbumController.createVoiceAlbum(req, res, next);
    expect(res._getJSONData()).toStrictEqual(voiceAlbumBody);
  });
});
