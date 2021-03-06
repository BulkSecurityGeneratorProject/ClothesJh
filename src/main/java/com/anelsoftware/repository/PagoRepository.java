package com.anelsoftware.repository;

import com.anelsoftware.domain.Encargo;
import com.anelsoftware.domain.Pago;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Pago entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PagoRepository extends JpaRepository<Pago,Long> {

    Page<Pago> findAllByEncargo(Pageable pageable, Encargo encargo);
}
