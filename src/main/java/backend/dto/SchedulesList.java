package backend.dto;



import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.util.List;

@JacksonXmlRootElement(localName = "schedules")
public class SchedulesList {

    @JacksonXmlProperty(localName = "schedule")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<ScheduleDto> schedules;

    // Геттеры, сеттеры, конструкторы
    public List<ScheduleDto> getSchedules() { return schedules; }
    public void setSchedules(List<ScheduleDto> schedules) { this.schedules = schedules; }
}
