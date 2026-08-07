-- Migración manual: la columna "age" (una sola edad) pasa a ser "ages"
-- (array, permite varias edades). Cada producto que ya tenía una edad
-- cargada queda con esa misma edad como único elemento del array — no
-- se pierde ni se toca nada a mano.
--
-- Cómo correrla: conectate a tu base (psql, el editor SQL de tu proveedor,
-- o `npx drizzle-kit studio`) y ejecutá este archivo una sola vez, ANTES
-- de deployar el código nuevo. Si usás `drizzle-kit push` normalmente,
-- corré esto a mano primero y después el push ya no debería pedirte
-- tocar la columna (el schema.ts ya quedó alineado con este resultado).

ALTER TABLE products RENAME COLUMN age TO ages;

ALTER TABLE products
  ALTER COLUMN ages TYPE text[]
  USING CASE WHEN ages IS NULL THEN NULL ELSE ARRAY[ages] END;
