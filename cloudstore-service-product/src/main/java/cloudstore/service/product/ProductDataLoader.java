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
    public void run(String... strings) throws Exception {
        List<Product> list = new ArrayList<>();
        list.add(new Product("1", 1, "PRD1", "DISPLAY1"));
        list.add(new Product("2", 2, "PRD2", "DISPLAY3"));
        list.add(new Product("3", 3, "PRD2", "DISPLAY3"));

        this.repository.save(list);
    }
}
