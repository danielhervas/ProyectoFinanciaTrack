package danielhervas.proyectotfc.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ComparadorController {

    @Value("${fmp.api.key}")
    private String apiKey;

    @GetMapping("/compare")
    public Map<String, Object> comparar(
            @RequestParam String symbol,
            @RequestParam String fecha) throws IOException {

        // La API de Cryptocompare no admite "from" directo, hacemos fetch de los datos diarios y filtramos
        // Usamos endpoint histoday con limit suficiente para abarcar desde la fecha pedida

        String url = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=" + symbol.toUpperCase() +
                "&tsym=USD&limit=200&api_key=" + apiKey;

        String json = new RestTemplate().getForObject(url, String.class);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json);

        if (!root.path("Response").asText().equals("Success")) {
            throw new IOException("Error al obtener datos de Cryptocompare");
        }

        JsonNode dataArray = root.path("Data").path("Data");
        if (!dataArray.isArray() || dataArray.size() == 0) {
            throw new IOException("Datos históricos vacíos");
        }

        // Convertir fecha "yyyy-MM-dd" a timestamp para comparar
        long fechaTimestamp = java.time.LocalDate.parse(fecha).atStartOfDay(java.time.ZoneOffset.UTC).toEpochSecond();

        Double precioInicio = null;
        Double precioActual = null;

        // Buscar precio de cierre en la fecha dada y precio actual (último dato)
        for (JsonNode nodo : dataArray) {
            long time = nodo.path("time").asLong();
            if (time == fechaTimestamp) {
                precioInicio = nodo.path("close").asDouble();
            }
        }

        // Precio actual = último dato
        JsonNode ultimoNodo = dataArray.get(dataArray.size() - 1);
        precioActual = ultimoNodo.path("close").asDouble();

        if (precioInicio == null) {
            throw new IOException("No se encontró precio para la fecha indicada");
        }

        double rendimiento = ((precioActual - precioInicio) / precioInicio) * 100;

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("fechaInicio", fecha);
        resultado.put("precioInicio", precioInicio);
        resultado.put("precioActual", precioActual);
        resultado.put("rendimiento", Math.round(rendimiento * 100.0) / 100.0);

        return resultado;
    }
}
