
---

## 💡 ¿Qué hace este proyecto?

Es un **sistema de gestión de parqueaderos** que maneja autenticación de administradores usando **Spring Boot**, **JWT** y **bcrypt** para proteger contraseñas. Todo está orientado a que solo usuarios autenticados (administradores) puedan acceder a las funcionalidades protegidas.

---

## 🔐 ¿Qué es bcrypt y para qué lo usas?

`bcrypt` se usa para **encriptar contraseñas**. Es decir:
- Cuando un admin se registra, su contraseña se **codifica** antes de guardarla en la base de datos.
- Luego, en el login, se compara la contraseña digitada con la codificada usando `bcrypt.matches(...)`.

Esto mejora la **seguridad**, porque aunque alguien robe la base de datos, no verá contraseñas en texto plano.

---

## 🧱 Estructura del proyecto

### 1. `Entity/Admin.java` 📄
Representa la tabla `Administrador` de la base de datos. Tiene:
- `idCard`: ID único del admin.
- `nameAdmin`: Nombre del admin.
- `password`: Contraseña (que será codificada con bcrypt).

---

### 2. `Repository/AdminRepository.java` 📚
Interfaz que extiende `JpaRepository` para hacer operaciones CRUD sobre los administradores.

---

### 3. `Security/WebSecurityConfig.java` 🔒
Crea un bean de `BCryptPasswordEncoder`, que es el componente que codifica contraseñas. Lo importante:

```java
@Bean(name = "customPasswordEncoder")
public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10); // El 10 es el "cost" o nivel de seguridad
}
```

---

### 4. `Service/AdminService.java` 🧠
Aquí está la lógica:
- **`save(Admin admin)`**: codifica la contraseña antes de guardar el admin.
- **`Update(...)`**: si llega una nueva contraseña, la actualiza y la vuelve a codificar.
- **`login(...)`**: verifica credenciales y, si son válidas, genera un **JWT token** con los datos del admin.

---

### 5. `Controller/AdminController.java` 🎮
Define los endpoints de la API:
- `GET /Administrador`: obtener todos los administradores (requiere login).
- `POST /Administrador`: registrar nuevo admin.
- `PUT /Administrador/{id}`: actualizar info de un admin.
- `DELETE /Administrador/{id}`: eliminar admin.
- `POST /Administrador/login`: verifica credenciales y retorna un token JWT si son válidas.

---

### 6. `JWT/CustomUserDetailsService.java` 🔑
Carga los datos del admin a partir del `idCard`. Esto es necesario para que Spring Security entienda cómo cargar usuarios y sus roles.

---

### 7. `JWT/JwtAuthenticationFilter.java` 🛡️
Este filtro intercepta las peticiones HTTP:
- Busca el token JWT en el header `"Authorization"`.
- Si es válido, **autentica** al usuario para esa petición.

---

### 8. `Configuration/WebConfig.java` 🌐
Permite que peticiones desde el frontend (por ejemplo, React) puedan acceder al backend. Configura CORS (Cross-Origin Resource Sharing).

---

## 🔁 Flujo resumido del login con JWT y bcrypt

1. El usuario se registra → su contraseña se codifica con `bcrypt` y se guarda.
2. El usuario hace login → se compara la contraseña digitada con la codificada.
3. Si todo está bien, se le da un **token JWT**.
4. Ese token se usa en las siguientes peticiones para acceder a los endpoints protegidos (como ver admins).

---

