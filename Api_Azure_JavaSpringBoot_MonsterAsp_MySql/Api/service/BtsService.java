package cz.sliva.nobodywebapi.service;

import cz.sliva.nobodywebapi.dto.BtsDto;
import cz.sliva.nobodywebapi.repository.BtsValuesRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BtsService {

    private BtsValuesRepository btsValuesRepository;

    public BtsService(BtsValuesRepository btsValuesRepository) {
        this.btsValuesRepository = btsValuesRepository;
    }

    public List<BtsDto> getAll(){
        return btsValuesRepository.findAllFlatAndTransformed();
    }

    public BtsDto getByCellId(int cellId){
        return btsValuesRepository.findFlatAndTransformedByCellid(cellId);
    }


    public List<BtsDto> getByListOfCellsId(String cellsIds){

        String[] inp = cellsIds.split(",");

        List<Integer> list = Arrays.stream(inp)
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        return btsValuesRepository.findFlatAndTransformedByCellidByList(list);
    }


}
