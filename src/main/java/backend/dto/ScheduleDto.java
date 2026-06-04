package backend.dto;



import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;

public class ScheduleDto {
    private String city;
    private String street;
    private String building;

    @JacksonXmlProperty(localName = "item")
    @JacksonXmlElementWrapper(localName = "items") // Маппит вложенный тег <items>
    private List<WorkItemDto> items;

    // Геттеры и сеттеры
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    public List<WorkItemDto> getItems() { return items; }
    public void setItems(List<WorkItemDto> items) { this.items = items; }
}
