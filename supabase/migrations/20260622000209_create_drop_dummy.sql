-- Create a dummy table and immediately drop it
-- This often forces PostgREST to reload its schema cache
CREATE TABLE IF NOT EXISTS public._schema_cache_refresh_dummy (id uuid);
DROP TABLE IF EXISTS public._schema_cache_refresh_dummy;
