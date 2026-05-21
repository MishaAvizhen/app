package backend.repository;

import backend.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>, QuerydslPredicateExecutor<Address> {
    // Больше никаких ручных @Query аннотаций здесь не требуется!
}
