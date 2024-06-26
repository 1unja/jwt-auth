"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepositories = void 0;
const user_service_1 = __importDefault(require("../service/user-service"));
const express_validator_1 = require("express-validator");
const api_errors_1 = __importDefault(require("../exceptions/api-errors"));
exports.authRepositories = {
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getAllUsers();
                res.json(users);
            }
            catch (e) {
                next(e);
            }
        });
    },
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validateErrors = (0, express_validator_1.validationResult)(req);
                if (!validateErrors.isEmpty()) {
                    return next(api_errors_1.default.BadRequest('Validation errors', validateErrors.array()));
                }
                const { email, password } = req.body;
                const userData = yield user_service_1.default.registration(email, password);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    },
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield user_service_1.default.login(email, password);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    },
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield user_service_1.default.logout(refreshToken);
                res.clearCookie('refreshToken');
                res.json(token);
            }
            catch (e) {
                next(e);
            }
        });
    },
    acitvateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                yield user_service_1.default.activation(activationLink);
                return res.redirect(`${process.env.CLIENT_URL}`);
            }
            catch (e) {
                next(e);
            }
        });
    },
    refreshUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const userData = yield user_service_1.default.refresh(refreshToken);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    },
};
