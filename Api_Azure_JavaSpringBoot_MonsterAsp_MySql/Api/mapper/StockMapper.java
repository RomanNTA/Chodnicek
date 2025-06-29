package cz.sliva.nobodywebapi.mapper;

import cz.sliva.nobodywebapi.dto.StockDto;
import cz.sliva.nobodywebapi.entity.StockEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockMapper {

    StockEntity toEntity(StockDto stockDto);

    StockDto toDto(StockEntity stockEntity);

}


