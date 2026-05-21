package backend.service;

import backend.entities.Address;
import backend.entities.QAddress;
import backend.repository.AddressRepository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


@Service
public class AddressService {

    @Autowired
    private AddressRepository repository;

    // Фабрика для построения гибких Querydsl запросов
    private final JPAQueryFactory queryFactory;

    @Autowired
    public AddressService(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    // 1. Автодополнение городов
    public List<String> suggestCities(String query) {
        if (query == null || query.trim().length() < 2) {
            return Collections.emptyList();
        }

        QAddress address = QAddress.address;

        return queryFactory
                .select(address.city)
                .distinct()
                .from(address)
                .where(address.city.toLowerCase().contains(query.trim().toLowerCase()))
                .offset(0L)
                .limit(7L)
                .fetch();
    }

    // 2. Автодополнение улиц (исправляет проблему 404/Null, когда город не задан)
    public List<String> suggestStreets(String query, String city) {
        if (query == null || query.trim().length() < 2) {
            return Collections.emptyList();
        }

        QAddress address = QAddress.address;
        BooleanBuilder builder = new BooleanBuilder();

        // Динамическое условие: если город передан, фильтруем по нему
        if (city != null && !city.trim().isEmpty() && !"null".equals(city) && !"undefined".equals(city)) {
            builder.and(address.city.equalsIgnoreCase(city.trim()));
        }

        // Обязательное условие поиска по подстроке улицы (LIKE %query%)
        builder.and(address.street.toLowerCase().contains(query.trim().toLowerCase()));

        return queryFactory
                .select(address.street)
                .distinct()
                .from(address)
                .where(builder) // Применяем собранные условия
                .offset(0L)
                .limit(7L)
                .fetch();
    }

    // 3. Главный поиск адресов с пагинацией (взамен старых Specification)
    public Page<Address> searchAddresses(String city, String street, String houseNumber, Pageable pageable) {
        QAddress address = QAddress.address;
        BooleanBuilder builder = new BooleanBuilder();

        if (city != null && !city.trim().isEmpty()) {
            builder.and(address.city.toLowerCase().contains(city.trim().toLowerCase()));
        }
        if (street != null && !street.trim().isEmpty()) {
            builder.and(address.street.toLowerCase().contains(street.trim().toLowerCase()));
        }
        if (houseNumber != null && !houseNumber.trim().isEmpty()) {
            builder.and(address.houseNumber.eq(houseNumber.trim()));
        }

        // Делаем запрос на получение контента страницы
        List<Address> content = queryFactory
                .selectFrom(address)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // Делаем запрос на общее количество (нужно для пагинации в Angular)
        long total = queryFactory
                .selectFrom(address)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(content, pageable, total);
    }

}

