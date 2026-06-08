package backend.conf;




import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.Arrays;
import java.util.Collections;


@Configuration

public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // 1. Включаем CORS. Spring сам найдет бин corsConfigurationSource()
                .cors()
                .and()
                // 2. Отключаем CSRF для REST API
                .csrf().disable()
                .authorizeRequests()
                // 3. ВАЖНО: Пропускаем все предварительные preflight-запросы (OPTIONS)
                .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                // 4. Остальные правила доступа
                .antMatchers("/", "/index.html", "/*.js", "/*.css", "/frontend/src/app/assets/**").permitAll()
                .antMatchers("/api/**").permitAll()
                .antMatchers("/", "/**").permitAll()
                .anyRequest().authenticated();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Разрешаем конкретные фронтенд-адреса (нельзя использовать "*" при allowCredentials(true))
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:8082",
                "http://192.168.100.50:8082",
                "https://app-5vck.onrender.com"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);

        // Время кеширования preflight-ответа браузером (в секундах)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
