import { __assign } from "tslib";
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, createClient, } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import throttle from 'lodash.throttle';
import { getRandomColor } from './randomColor';
var MAX_EVENTS_PER_SECOND = 10;
export var useRealtimeMouses = function (_a) {
    var supabaseUrl = _a.supabaseUrl, supabaseKey = _a.supabaseKey, roomId = _a.roomId;
    var supabase = useMemo(function () { return createClient(supabaseUrl, supabaseKey); }, [supabaseKey, supabaseUrl]);
    var _b = useState(null), channel = _b[0], setChannel = _b[1];
    var _c = useState({}), users = _c[0], setUsers = _c[1];
    useEffect(function () {
        var messageChannel = supabase.channel(roomId);
        // Listen for cursor positions from other users in the room
        messageChannel.on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'POS' }, function (payload) {
            setUsers(function (users) {
                var _a, _b, _c, _d, _e, _f;
                var userId = payload.payload.user_id;
                var existingUser = users[userId];
                if (existingUser) {
                    var x = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0;
                    var y = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0;
                    users[userId] = __assign(__assign({}, existingUser), { x: x, y: y });
                    users = cloneDeep(users);
                }
                else {
                    users[userId] = {
                        x: (_e = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _e === void 0 ? void 0 : _e.x,
                        y: (_f = payload === null || payload === void 0 ? void 0 : payload.payload) === null || _f === void 0 ? void 0 : _f.y,
                        color: getRandomColor(),
                        hue: getRandomColor(),
                    };
                }
                return users;
            });
        });
        messageChannel.subscribe(function (status) {
            if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
                // Setting this in state so that we can use it for tracking movements
                setChannel(messageChannel);
            }
        });
        return function () {
            messageChannel && supabase.removeChannel(messageChannel);
        };
    }, [roomId, supabase]);
    // Lodash throttle will be removed once realtime-js client throttles on the channel level
    var sendMouseBroadcast = throttle(function (_a) {
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
