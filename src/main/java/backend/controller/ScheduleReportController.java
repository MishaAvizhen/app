package backend.controller;

import backend.dto.SchedulesList;
import backend.service.ScheduleReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

@RestController
@RequestMapping("/api/reports")
public class ScheduleReportController {

    private final ScheduleReportService scheduleService;

    // Внедрение сервиса через конструктор
    public ScheduleReportController(ScheduleReportService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping(value = "/schedule-json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SchedulesList> getScheduleJson() {
        try {
            SchedulesList scheduleList = scheduleService.fetchScheduleReport();
            return ResponseEntity.ok(scheduleList);
        } catch (RestClientException e) {
            // Возвращаем 502 Bad Gateway вместо "маскировки" ошибки под успешный пустой ответ
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }
}
