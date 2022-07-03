"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var image_size_1 = __importDefault(require("image-size"));
var index_1 = __importDefault(require("../../../index"));
describe('GET /api/images', function () {
    it('responds with 400 if called without parameters', function (done) {
        (0, supertest_1.default)(index_1.default).get('/api/images').expect(400, done);
    });
    it('responds with 400 if called with a missing parameter', function (done) {
        (0, supertest_1.default)(index_1.default).get('/api/images?filename=test&height=100').expect(400, done);
    });
    it('responds with 404 if called correctly but image does not exist', function (done) {
        (0, supertest_1.default)(index_1.default)
            .get('/api/images?filename=test&height=100&width=100')
            .expect(404, done);
    });
    it('responds with 200 if called correctly and image exist', function (done) {
        (0, supertest_1.default)(index_1.default)
            .get('/api/images?filename=fjord&height=100&width=100')
            .expect(200, done);
    });
    it('created a thumb version of the image', function (done) {
        (0, supertest_1.default)(index_1.default)
            .get('/api/images?filename=fjord&height=100&width=100')
            .then(function () {
            promises_1.default.stat(path_1.default.resolve(__dirname, '../../../assets/thumb/fjord-100x100.jpg')).then(function (fileStat) { return expect(fileStat).not.toBeNull(); });
            done();
        });
    });
    it('created a thumb version of the image with the correct height and width', function (done) {
        (0, supertest_1.default)(index_1.default)
            .get('/api/images?filename=fjord&height=100&width=150')
            .then(function () {
            var dimensions = (0, image_size_1.default)(path_1.default.resolve(__dirname, './../../images'));
            expect(dimensions.height).toEqual(100);
            expect(dimensions.width).toEqual(150);
            done();
        });
    });
});
