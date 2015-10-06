package cloudstore.service.product.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author chanwook
 */
@Entity
@Table(name = "PRD_PRODUCT")
@Getter
@Setter
@AllArgsConstructor
public class Product {

    @Id
    @JsonInclude
    private String productId;

    //TODO MTA-level 1
    @Column(nullable = false)
    private long tenantId;

    @Column(length = 100, nullable = false)
    private String productName;

    @Column(length = 255, nullable = true)
    private String displayName;

    public Product() {
    }
}
