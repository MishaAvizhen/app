package backend.service;

import backend.conf.SupabaseProperties;
import backend.dto.SchedulesList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class ScheduleReportService {

    private static final Logger log = LoggerFactory.getLogger(ScheduleReportService.class);

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabaseProperties; // Внедряем типизированные свойства

    public ScheduleReportService(RestTemplateBuilder builder, SupabaseProperties supabaseProperties) {
        this.supabaseProperties = supabaseProperties;

        MappingJackson2XmlHttpMessageConverter xmlConverter = new MappingJackson2XmlHttpMessageConverter();
        xmlConverter.setSupportedMediaTypes(java.util.Arrays.asList(
                MediaType.APPLICATION_XML,
                MediaType.TEXT_PLAIN
        ));

        this.restTemplate = builder
                .additionalMessageConverters(xmlConverter)
                .build();
    }

    public SchedulesList fetchScheduleReport() {
        try {
            // Получаем URL через геттер объекта конфигурации
            String url = supabaseProperties.getScheduleReportUrl();

            ResponseEntity<SchedulesList> response = restTemplate.getForEntity(url, SchedulesList.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("Successfully fetched and parsed schedule report from Supabase");
                return response.getBody();
            }

            throw new RestClientException("Supabase returned unexpected status code: " + response.getStatusCode());

        } catch (RestClientException e) {
            log.error("Error fetching or parsing XML from Supabase: {}", e.getMessage(), e);
            throw e;
        }
    }
}
