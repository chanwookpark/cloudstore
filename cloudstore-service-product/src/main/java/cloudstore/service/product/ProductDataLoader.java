package cloudstore.service.product;

import cloudstore.service.product.entity.Product;
import cloudstore.service.product.repository.ProductJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author chanwook
 */
@Component
@Transactional
public class ProductDataLoader implements CommandLineRunner {

    @Autowired
    ProductJpaRepository repository;

    @Override
    public void run(String... args) throws Exception {
        int max = getMaxIndex(args);
        List<Product> list = new ArrayList<>();
        for (int i = 1; i < max; i++) {
            list.add(new Product(String.valueOf(i), i, "PRD" + i, "DISPLAY" + i));
        }

        this.repository.save(list);
    }

    private int getMaxIndex(String[] args) {
        for (String arg : args) {
            if ("MAX_PRD_LOAD".equals(arg)) {
                return Integer.valueOf(arg);
            }
        }
        return 20;
    }
}
