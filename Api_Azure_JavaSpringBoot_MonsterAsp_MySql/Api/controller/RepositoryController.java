package cz.sliva.nobodywebapi.controller;

import cz.sliva.nobodywebapi.dto.StockDto;
import cz.sliva.nobodywebapi.repository.SelectStockInfo;
import cz.sliva.nobodywebapi.repository.SelectStockJson;
import cz.sliva.nobodywebapi.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RepositoryController {

    RepositoryService reps;

    @Autowired
    public RepositoryController(RepositoryService reps) {
        this.reps = reps;
    }

    @GetMapping({"/Repository/headers", "/Repository/headers/"})
    public List<SelectStockInfo> getRepositoryHeaders() {
        return reps.getRepositoryHeaders();
    }

    @GetMapping("/Repository/detail/{uuid}")
    public SelectStockInfo getRepositoryInfo(@PathVariable String uuid ) {
        return reps.getRepositoryByUuidInfo(uuid );
    }

    @GetMapping("/Repository/json/{uuid}")
    public SelectStockJson getRepositoryJson(@PathVariable String uuid ) {
        return reps.getRepositoryByUuidJson(uuid);
    }

    @PostMapping({"/Repository","/Repository/"})
    public StockDto Insert(@RequestBody StockDto stockRep ) {
        return reps.Insert(stockRep);
    }

    @DeleteMapping("/Repository/{uuid}")
    public ResponseEntity<StockDto> Delete(@PathVariable String uuid ) {
        return reps.delete(uuid);
    }

}
