SELECT x, y, pix, user_id, time
  FROM pix p1
  WHERE time = (
    SELECT MAX(time)
      FROM pix p2
      WHERE p2.x = p1.x AND p2.y = p1.y
  )