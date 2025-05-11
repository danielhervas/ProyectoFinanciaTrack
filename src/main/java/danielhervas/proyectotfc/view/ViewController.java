package danielhervas.proyectotfc.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
    @GetMapping("/inicio" )
    public String inicio() {

        return "index";
    }

    @GetMapping("/markets" )
    public String markets() {

        return "markets";
    }

    @GetMapping("/news" )
    public String news() {

        return "news";
    }




}
