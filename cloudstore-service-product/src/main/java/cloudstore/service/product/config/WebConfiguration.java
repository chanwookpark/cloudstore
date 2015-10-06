package cloudstore.service.product.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.Arrays;

/**
 * @author chanwook
 */
@Configuration
public class WebConfiguration extends WebMvcConfigurerAdapter {

    // FIXME 인식이 안되어 일단 직접 Filter로 돌아가게 작성해둠 ..
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("x-requested-with", "x-http-method-override", "x-requested-by", "Content-Type", "accept")
                .allowCredentials(false)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .exposedHeaders("x-requested-with", "x-http-method-override", "x-requested-by", "Content-Type", "accept")
                .allowedOrigins("*");
    }

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource configSource = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(false);
        config.setAllowedHeaders(Arrays.asList("x-requested-with", "x-http-method-override", "x-requested-by", "Content-Type", "accept"));
        config.setExposedHeaders(Arrays.asList("x-requested-with", "x-http-method-override", "x-requested-by", "Content-Type", "accept"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedOrigins(Arrays.asList("*", "http://localhost:80001"));
        configSource.registerCorsConfiguration("/api/**", config);

        CorsFilter filter = new CorsFilter(configSource);
        return filter;
    }
}
