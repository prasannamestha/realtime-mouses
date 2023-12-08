# Realtime Mouses

Realtime mouses for you react/nextjs app. This is a piece of code taken from the realtime mouses implementation at [UiBun.dev](https://uibun.dev).

<img width="1383" alt="Screenshot 2023-12-08 at 10 07 26 PM" src="https://github.com/prasannamestha/realtime-mouses/assets/24790143/c679fcbe-5b20-403d-af2f-9a063190aba0">

## Installation

```
$ npm i realtime-mouses
```

## Requirements

1. react
2. @supabase/supabase-js

## Usage

```
import { useRealtimeMouses, Cursor } from 'realtime-mouses';

const Page = () => {
  const { mouses, track } = useRealtimeMouses({
    roomId: 'message-room-id',
    supabaseUrl: '<supabase url>',
    supabaseKey: '<your supabase key here>',
  });

  // Trigger mouse track event when mouse moves
  useEffect(() => {
    const setMouseEvent = (e: MouseEvent) => {
      const [x, y] = [e.pageX, e.pageY];
      track({ x, y, name: getUserName() }); // getUserName() can be randomly generated name
    };

    window.addEventListener('mousemove', setMouseEvent);
    return () => {
      window.removeEventListener('mousemove', setMouseEvent);
    };
  }, [track]);

  // Render the cursors
  return Object.entries(mouses)
    .filter(([_, data]) => data.x && data.y) // do not render own cursor
    .map(([name, data]) => {
      const { x, y, color, hue } = data;
      return (
        <Cursor key={name} x={x} y={y} color={color} hue={hue} userId={name} />
      );
    });
}
```

## Credits

This project was created by [Prasanna Mestha](https://prasannamestha.com). Follow me on Twitter [@prasannamestha](https://twitter.com/prasannamestha). If you liked this, consider checking out [UiBun.dev](https://uibun.dev) too.
