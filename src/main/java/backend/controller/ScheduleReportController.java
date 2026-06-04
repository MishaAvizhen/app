package backend.controller;

import backend.dto.SchedulesList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/reports")
public class ScheduleReportController {

    public static final String SUPABASE_URL = "https://jgybhsbiubblcerwvsuo.supabase.co/storage/v1/object/public/ista-schedule-report/schedule_report.xml";


    private static final Logger log = LoggerFactory.getLogger(ScheduleReportController.class);
    private final RestTemplate restTemplate;

    {
        restTemplate = new RestTemplate();

        // 1. Создаем XML конвертер
        org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter xmlConverter =
                new org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter();

        // 2. Указываем, что он должен обрабатывать абсолютно любые типы контента (включая text/plain от Supabase)
        xmlConverter.setSupportedMediaTypes(java.util.Collections.singletonList(org.springframework.http.MediaType.ALL));

        // 3. Регистрируем настроенный конвертер в RestTemplate
        restTemplate.getMessageConverters().add(xmlConverter);
    }


    @GetMapping(value = "/schedule-json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SchedulesList> getScheduleJson() {
        try {
            // Передаем SchedulesList.class — Spring использует Jackson XML для парсинга ответа Supabase
            ResponseEntity<SchedulesList> response = restTemplate.getForEntity(SUPABASE_URL, SchedulesList.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Success1");
                // Возвращаем объект. Spring MVC автоматически преобразует его в JSON для Angular
                return ResponseEntity.ok(response.getBody());
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        } catch (RestClientException e) {
            log.error("Error fetching or parsing XML from Supabase", e);
            // Возвращаем пустую структуру в формате JSON в случае сбоя
            return ResponseEntity.ok(new SchedulesList());
        }
    }

}
