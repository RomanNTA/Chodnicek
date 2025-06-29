package cz.sliva.nobodywebapi.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        WebMvcConfigurer.super.addCorsMappings(registry);
        registry.addMapping("/**")
                .allowedMethods("HEAD","GET","POST","PUT","DELETE","OPTIONS")
                .allowedOriginPatterns("**")
                // vše anebo přesná adresa, kde leží frontend. Pokud je to api ... tak pro všechny.
                .allowCredentials(true);

    }
}
