package cloudstore.front.car;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author chanwook
 */
@SpringBootApplication
@RestController
public class CarFrontApp extends SpringBootServletInitializer {

    @Autowired
    Environment env;

    @RequestMapping("/")
    public String hello() {
        return "hello";
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(CarFrontApp.class);
    }


    public static void main(String[] args) {
        SpringApplication.run(CarFrontApp.class, args);
    }

}
