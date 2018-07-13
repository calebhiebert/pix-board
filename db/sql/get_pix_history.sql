SELECT id, x, y, pix, user_id, time 
  FROM pix
  WHERE x = ${x} AND y = ${y}
  LIMIT 5