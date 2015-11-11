package cloudstore.front.car;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.script.ScriptTemplateConfigurer;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author chanwook
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.scriptTemplate().prefix("/static/templates/").suffix(".html");
    }

    @Bean
    public ScriptTemplateConfigurer scriptTemplateConfigurer() throws IOException {
        final ScriptTemplateConfigurer configurer = new ScriptTemplateConfigurer();
        configurer.setRenderFunction("render");
        configurer.setSharedEngine(true);

        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        configurer.setEngine(engine);
        addScripts(configurer);

        return configurer;
    }

    private void addScripts(ScriptTemplateConfigurer configurer) throws IOException {
        List<String> scripts = new ArrayList<>();
        scripts.add("/static/js/polyfill.js");
        scripts.add("/static/js/react-render.js");
        scripts.add("/static/js/dust-render.js");
        scripts.add("/META-INF/resources/webjars/dustjs-linkedin/2.6.1/dust-full.js");

        // add jsx components
//        scripts.add("/static/component/productSlide.js");

        configurer.setScripts(scripts.toArray(new String[scripts.size()]));
    }
}
