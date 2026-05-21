package backend.controller;

import backend.entities.Address;
import backend.service.AddressService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



import java.util.List;

@RestController
@RequestMapping("/api/addresses")

public class AddressController {

    private AddressService service;

    public AddressController(AddressService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Address>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String street,
            @RequestParam(required = false) String houseNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.searchAddresses(city, street, houseNumber, pageable));
    }

    // Эндпоинт для автодополнения городов (ограничим топ-5 совпадений)
    @GetMapping("/autocomplete/city")
    public ResponseEntity<List<String>> autocompleteCity(@RequestParam String query) {
        return ResponseEntity.ok(service.suggestCities(query));
    }
    @GetMapping("/autocomplete/street")
    public ResponseEntity<List<String>> autocompleteStreet(
            @RequestParam String query,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(service.suggestStreets(query, city));
    }

}
