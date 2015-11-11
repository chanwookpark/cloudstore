package cloudstore.front.car.product;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author chanwook
 */
@Controller
public class ProductController {

    @RequestMapping("/product/{productId}")
    public String viewCar(@PathVariable String productId, ModelMap model) {

        model.put("productId", productId);
        return "product";
    }
}
