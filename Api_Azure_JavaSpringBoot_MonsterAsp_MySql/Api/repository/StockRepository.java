package cz.sliva.nobodywebapi.repository;

import cz.sliva.nobodywebapi.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<StockEntity,Integer> {
    <T> List<T> findAllProjectedBy(Class<T> type);
    <T> Optional<T> findByUuid(String uuid, Class<T> type);
}
