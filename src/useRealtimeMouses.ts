import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
  createClient,
} from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import { Coordinates, Payload, User } from './types';
import cloneDeep from 'lodash.clonedeep';
import throttle from 'lodash.throttle';
import { getRandomColor } from './randomColor';

const MAX_EVENTS_PER_SECOND = 10;

type UseRealtimeMousesArgs = {
  supabaseUrl: string;
  supabaseKey: string;
  roomId: string;
};

export const useRealtimeMouses = ({
  supabaseUrl,
  supabaseKey,
  roomId,
}: UseRealtimeMousesArgs) => {
  const supabase = useMemo(
    () => createClient(supabaseUrl, supabaseKey),
    [supabaseKey, supabaseUrl]
  );

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    const messageChannel: RealtimeChannel = supabase.channel(roomId);
    // Listen for cursor positions from other users in the room
    messageChannel.on(
      REALTIME_LISTEN_TYPES.BROADCAST,
      { event: 'POS' },
      (payload: Payload<{ user_id: string } & Coordinates>) => {
        setUsers((users) => {
          const userId = payload!.payload!.user_id;
          const existingUser = users[userId];

          if (existingUser) {
            const x = payload?.payload?.x ?? 0;
            const y = payload?.payload?.y ?? 0;

            users[userId] = { ...existingUser, ...{ x, y } };
            users = cloneDeep(users);
          } else {
            users[userId] = {
              x: payload?.payload?.x,
              y: payload?.payload?.y,
              color: getRandomColor(),
              hue: getRandomColor(),
            };
          }

          return users;
        });
      }
    );

    messageChannel.subscribe((status: `${REALTIME_SUBSCRIBE_STATES}`) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        // Setting this in state so that we can use it for tracking movements
        setChannel(messageChannel);
      }
    });

    return () => {
      messageChannel && supabase.removeChannel(messageChannel);
    };
  }, [roomId, supabase]);

  // Lodash throttle will be removed once realtime-js client throttles on the channel level
  const sendMouseBroadcast = throttle(({ x, y, name }: any) => {
    if (!channel) return;
    channel
      .send({
        type: 'broadcast',
        event: 'POS',
        payload: { user_id: name, x, y },
      })
      .catch(() => {});
  }, 1000 / MAX_EVENTS_PER_SECOND);

  return {
    mouses: users,
    track: sendMouseBroadcast,
  };
};
