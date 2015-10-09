package cloudstore.service.product.config;

import org.springframework.cloud.aws.jdbc.config.annotation.EnableRdsInstance;
import org.springframework.cloud.aws.jdbc.config.annotation.RdsInstanceConfigurer;
import org.springframework.cloud.aws.jdbc.datasource.TomcatJdbcDataSourceFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.Profile;

/**
 * @author chanwook
 */
@Profile("aws")
@Configuration
@ImportResource(locations = "applicationcontext-aws.xml")
@EnableRdsInstance(dbInstanceIdentifier = "clsprd", databaseName = "clsprd", username = "clsprd", password = "clsprd00", readReplicaSupport = false)
public class RdsConfiguration {

    @Bean
    public RdsInstanceConfigurer rdsConfigurer() {
        return () -> {
            final TomcatJdbcDataSourceFactory factory = new TomcatJdbcDataSourceFactory();
            factory.setInitialSize(5);
            factory.setValidationQuery("SELECT 1 FROM DUAL");
            return factory;
        };
    }
}
