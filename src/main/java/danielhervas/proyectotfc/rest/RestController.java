package danielhervas.proyectotfc.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @GetMapping("/home")
    public ResponseEntity<String> obtenerDividendos() {
        String url = "https://api.polygon.io/v3/reference/dividends?apiKey=RopZaC2quLK8VmMiq5ycGhADtSYJNEAn";
        RestTemplate restTemplate = new RestTemplate();
        String respuesta = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(respuesta);
    }

    //falta por poner en el pom.xml jpa y mysql
}
