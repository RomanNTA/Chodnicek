package cz.sliva.nobodywebapi.service;


import cz.sliva.nobodywebapi.dto.StockDto;
import cz.sliva.nobodywebapi.mapper.StockMapper;
import cz.sliva.nobodywebapi.repository.SelectStockInfo;
import cz.sliva.nobodywebapi.repository.SelectStockJson;
import cz.sliva.nobodywebapi.repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepositoryService {

    //private RepositoryMapper repositoryMapper;
    private StockRepository repos;
    private StockMapper mapper;

    public RepositoryService(StockRepository repos, StockMapper mapper) {
        this.repos = repos;
        this.mapper = mapper;
    }

    public List<SelectStockInfo> getRepositoryHeaders() {
        return repos.findAllProjectedBy(SelectStockInfo.class);
    }

    public SelectStockInfo getRepositoryByUuidInfo(String uuid) {
        return repos.findByUuid(uuid, SelectStockInfo.class).orElse(null);
    }

    public SelectStockJson getRepositoryByUuidJson(String uuid) {
        return repos.findByUuid(uuid, SelectStockJson.class).orElse(null);
    }

    @Transactional
    public StockDto Insert(StockDto stockRep) {
        return mapper.toDto(repos.save(mapper.toEntity(stockRep)));
    }

    @Transactional
    public ResponseEntity<StockDto> delete(String uuid) {
        SelectStockInfo resource = repos.findByUuid(uuid, SelectStockInfo.class).orElse(null);
        if (resource != null){
            repos.deleteById(resource.getId());
            return ResponseEntity.ok().build();
        } else return ResponseEntity.notFound().build();
    }


}
