## Placement Service

Places pixels on the board, updates the database and redis, sends events to the right places

#### Placement Service

Note: All incoming data must be in the msgpack format

Accepts (`placement` channel):

```javascript
{
  x: 5, // X location of the pixel
  y: 5, // Y location of the pixel
  pix: 6, // Pixel color index
  userId: 'example user id', // Auth0 User id
}
```
