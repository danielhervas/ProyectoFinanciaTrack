package danielhervas.proyectotfc.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    @Value("${fmp.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://financialmodelingprep.com/stable/historical-price-eod/light?symbol=";

    private String fetchFromFMP(String symbol) {
        String url = BASE_URL + symbol + "&apikey=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class);
    }

    @GetMapping("/googl")
    public ResponseEntity<String> getGooglData() {
        return ResponseEntity.ok(fetchFromFMP("GOOGL"));
    }

    @GetMapping("/amzn")
    public ResponseEntity<String> getAmznData() {
        return ResponseEntity.ok(fetchFromFMP("AMZN"));
    }

    @GetMapping("/aapl")
    public ResponseEntity<String> getAaplData() {
        return ResponseEntity.ok(fetchFromFMP("AAPL"));
    }

    @GetMapping("/meta")
    public ResponseEntity<String> getMetaData() {
        return ResponseEntity.ok(fetchFromFMP("META"));
    }

    @GetMapping("/nvda")
    public ResponseEntity<String> getNvdaData() {
        return ResponseEntity.ok(fetchFromFMP("NVDA"));
    }

    @GetMapping("/tsla")
    public ResponseEntity<String> getTslaData() {
        return ResponseEntity.ok(fetchFromFMP("TSLA"));
    }
}
