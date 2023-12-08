"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtimeMouses = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var react_1 = require("react");
var lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
var lodash_throttle_1 = __importDefault(require("lodash.throttle"));
var randomColor_1 = require("./randomColor");
var MAX_EVENTS_PER_SECOND = 10;
var useRealtimeMouses = function (_a) {
    var supabaseUrl = _a.supabaseUrl, supabaseKey = _a.supabaseKey, roomId = _a.roomId;
    var supabase = (0, react_1.useMemo)(function () { return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey); }, [supabaseKey, supabaseUrl]);
    var _b = (0, react_1.useState)(null), channel = _b[0], setChannel = _b[1];
    var _c = (0, react_1.useState)({}), users = _c[0], setUsers = _c[1];
    (0, react_1.useEffect)(function () {
        var messageChannel = supabase.channel(roomId);
        // Listen for cursor positions from other users in the room
        messageChannel.on(supabase_js_1.REALTIME_LISTEN_TYPES.BROADCAST, { event: 'POS' }, function (payload) {
            setUsers(function (users) {
                var _a, _b, _c, _d, _e, _f;
                var userId = payload.payload.user_id;
                var existingUser = users[userId];
                if (existingUser) {
                    var x = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0;
                    var y = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0;
                    users[userId] = __assign(__assign({}, existingUser), { x: x, y: y });
                    users = (0, lodash_clonedeep_1.default)(users);
                }
                else {
                    users[userId] = {
                        x: (_e = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _e === void 0 ? void 0 : _e.x,
                        y: (_f = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _f === void 0 ? void 0 : _f.y,
                        color: (0, randomColor_1.getRandomColor)(),
                        hue: (0, randomColor_1.getRandomColor)(),
                    };
                }
                return users;
            });
        });
        messageChannel.subscribe(function (status) {
            if (status === supabase_js_1.REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
                // Setting this in state so that we can use it for tracking movements
                setChannel(messageChannel);
            }
        });
        return function () {
            messageChannel && supabase.removeChannel(messageChannel);
        };
    }, [roomId, supabase]);
    // Lodash throttle will be removed once realtime-js client throttles on the channel level
    var sendMouseBroadcast = (0, lodash_throttle_1.default)(function (_a) {
        var x = _a.x, y = _a.y, name = _a.name;
        if (!channel)
            return;
        channel
            .send({
            type: 'broadcast',
            event: 'POS',
            payload: { user_id: name, x: x, y: y },
        })
            .catch(function () { });
    }, 1000 / MAX_EVENTS_PER_SECOND);
    return {
        mouses: users,
        track: sendMouseBroadcast,
    };
};
exports.useRealtimeMouses = useRealtimeMouses;
