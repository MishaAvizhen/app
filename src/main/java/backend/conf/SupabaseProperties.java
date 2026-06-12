package backend.conf;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

@ConstructorBinding // Делает поля final и включает привязку через конструктор
@ConfigurationProperties(prefix = "supabase") // Все свойства должны начинаться с "supabase."
public class SupabaseProperties {

    private final String scheduleReportUrl;

    public SupabaseProperties(String scheduleReportUrl) {
        this.scheduleReportUrl = scheduleReportUrl;
    }

    public String getScheduleReportUrl() {
        return scheduleReportUrl;
    }
}
