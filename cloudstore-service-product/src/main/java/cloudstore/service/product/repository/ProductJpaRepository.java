package cloudstore.service.product.repository;

import cloudstore.service.product.entity.Product;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author chanwook
 */
public interface ProductJpaRepository extends PagingAndSortingRepository<Product, String> {
}
