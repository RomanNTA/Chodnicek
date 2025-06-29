package cz.sliva.nobodywebapi.repository;


import cz.sliva.nobodywebapi.dto.BtsDto;
import cz.sliva.nobodywebapi.entity.BtsValuesEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BtsValuesRepository extends JpaRepository<BtsValuesEntity, Integer> {

    @EntityGraph(attributePaths = {"btsAdrId"})
    List<BtsValuesEntity> findAll();

    @EntityGraph(attributePaths = {"btsAdrId"})
    Optional<BtsValuesEntity> findById(Integer id);

    @Query("SELECT NEW cz.sliva.nobodywebapi.dto.BtsDto(" +
            "bv.id, bv.cellid, bv.physcid, bv.tac, bv.band, bv.gsmcid, " +
            "bv.datum, ba.okres, ba.adresa, bv.adrId" +
            ") FROM BtsValuesEntity bv JOIN bv.btsAdrId ba")
    List<BtsDto> findAllFlatAndTransformed();

    @Query("SELECT NEW cz.sliva.nobodywebapi.dto.BtsDto(" +
            "bv.id, bv.cellid, bv.physcid, bv.tac, bv.band, bv.gsmcid, " +
            "bv.datum, ba.okres, ba.adresa, bv.adrId" +
            ") FROM BtsValuesEntity bv JOIN bv.btsAdrId ba WHERE bv.cellid = :cellid")
    BtsDto findFlatAndTransformedByCellid(@Param("cellid") int cellid);

    @Query("SELECT NEW cz.sliva.nobodywebapi.dto.BtsDto(" +
            "bv.id, bv.cellid, bv.physcid, bv.tac, bv.band, bv.gsmcid, " +
            "bv.datum, ba.okres, ba.adresa, bv.adrId" +
            ") FROM BtsValuesEntity bv JOIN bv.btsAdrId ba WHERE bv.cellid  in (:cellIds)")
    List<BtsDto> findFlatAndTransformedByCellidByList(@Param("cellIds") List<Integer> cellIds);



}