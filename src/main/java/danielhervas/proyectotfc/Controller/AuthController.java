package danielhervas.proyectotfc.Controller;

import danielhervas.proyectotfc.DTO.AuthRequest;
import danielhervas.proyectotfc.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    @Lazy
    private UserService userService;


    @PostMapping("/register")
    public void register(@RequestParam String email, @RequestParam String password, HttpServletResponse response) throws IOException {
        AuthRequest request = new AuthRequest();
        request.setEmail(email);
        request.setPassword(password);

        // Realiza el registro y obtiene el token
        String token = userService.register(request).getToken();

        // Crea y configura la cookie
        Cookie cookie = new Cookie("token", token);

        cookie.setPath("/");
        cookie.setMaxAge(3600); // 1 hora
        response.addCookie(cookie);

        // Redirige al usuario a la página de inicio
        response.sendRedirect("/inicio");
    }


    @PostMapping("/login")
    public void login(@RequestParam String email, @RequestParam String password, HttpServletResponse response) throws IOException {
        AuthRequest request = new AuthRequest();
        request.setEmail(email);
        request.setPassword(password);

        // Realiza la autenticación y obtiene el token
        String token = userService.login(request).getToken();

        // Crea y configura la cookie
        Cookie cookie = new Cookie("token", token);

        cookie.setPath("/");
        cookie.setMaxAge(3600); // 1 hora
        response.addCookie(cookie);

        // Redirige al usuario a la página de inicio
        response.sendRedirect("/inicio");
    }


}
