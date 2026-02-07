# Base de Datos - OneView

Este directorio contiene el esquema y las migraciones de la base de datos para OneView.

## 📁 Archivos

- `schema.sql`: Esquema completo de la base de datos (tablas, índices, triggers, políticas RLS)
- `DESIGN.md`: Documentación detallada del diseño de la base de datos
- `README.md`: Este archivo

## 🚀 Cómo Aplicar el Esquema en Supabase

### Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. **Accede a tu proyecto en Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto "OneView"

2. **Abre el SQL Editor**
   - En el menú lateral, haz clic en "SQL Editor"
   - Haz clic en "New query"

3. **Copia y pega el esquema**
   - Abre el archivo `schema.sql`
   - Copia todo el contenido
   - Pégalo en el editor SQL de Supabase

4. **Ejecuta el script**
   - Haz clic en "Run" o presiona `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux)
   - Verifica que no haya errores

5. **Verifica las tablas**
   - Ve a "Table Editor" en el menú lateral
   - Deberías ver todas las tablas creadas:
     - customers
     - products
     - orders
     - order_items
     - checkouts
     - checkout_items
     - refunds

### Opción 2: Desde la Línea de Comandos (Avanzado)

Si tienes `psql` instalado y configurado:

```bash
# Conectarte a Supabase
psql "postgresql://postgres:[TU_PASSWORD]@db.bybbtzurlcxybdwwaiqn.supabase.co:5432/postgres"

# Ejecutar el esquema
\i database/schema.sql
```

**Nota:** Reemplaza `[TU_PASSWORD]` con la contraseña de tu base de datos de Supabase.

## ✅ Verificación

Después de aplicar el esquema, verifica que:

1. **Todas las tablas existen:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('customers', 'products', 'orders', 'order_items', 'checkouts', 'checkout_items', 'refunds');
   ```

2. **Los índices están creados:**
   ```sql
   SELECT indexname 
   FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND indexname LIKE 'idx_%';
   ```

3. **Las políticas RLS están activas:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('customers', 'products', 'orders', 'order_items', 'checkouts', 'checkout_items', 'refunds');
   ```

## 🔄 Próximos Pasos

Una vez aplicado el esquema:

1. ✅ Verificar que todas las tablas se crearon correctamente
2. ✅ Probar insertar datos de prueba (opcional)
3. ✅ Continuar con la implementación de la sincronización con Shopify
4. ✅ Implementar los endpoints de API para los KPIs

## 🆘 Troubleshooting

### Error: "relation already exists"
- Algunas tablas ya existen. Puedes eliminarlas primero o usar `CREATE TABLE IF NOT EXISTS` (ya incluido en el script)

### Error: "permission denied"
- Verifica que estás usando las credenciales correctas
- Asegúrate de tener permisos de administrador en el proyecto

### Error: "extension already exists"
- El mensaje es informativo, no es un error. La extensión UUID ya está instalada.

## 📚 Documentación Adicional

- [Documentación de Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Ver `DESIGN.md` para detalles del diseño del esquema

