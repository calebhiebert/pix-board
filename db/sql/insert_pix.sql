INSERT INTO pix (x, y, pix, user_id)
  VALUES (${x}, ${y}, ${pix}, ${user_id})
  RETURNING id