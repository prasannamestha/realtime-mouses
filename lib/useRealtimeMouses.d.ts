/// <reference types="lodash" />
import { User } from './types';
type UseRealtimeMousesArgs = {
    supabaseUrl: string;
    supabaseKey: string;
    roomId: string;
};
export declare const useRealtimeMouses: ({ supabaseUrl, supabaseKey, roomId, }: UseRealtimeMousesArgs) => {
    mouses: {
        [key: string]: User;
    };
    track: import("lodash").DebouncedFunc<({ x, y, name }: any) => void>;
};
export {};
