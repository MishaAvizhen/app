package backend.entities.base;


import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class SimpleIdentifiedEntity {
    private Integer id;


    @Id
    @Column(name = "id")
    @GeneratedValue
    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

}
