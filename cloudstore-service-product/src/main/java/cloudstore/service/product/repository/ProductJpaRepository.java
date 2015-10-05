package cloudstore.service.product.repository;

import cloudstore.service.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author chanwook
 */
public interface ProductJpaRepository extends JpaRepository<Product, String> {
}
