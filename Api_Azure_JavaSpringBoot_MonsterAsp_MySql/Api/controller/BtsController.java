package cz.sliva.nobodywebapi.controller;

import cz.sliva.nobodywebapi.dto.BtsDto;
import cz.sliva.nobodywebapi.dto.CellIdDto;
import cz.sliva.nobodywebapi.service.BtsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BtsController {

    private BtsService btss;

    @Autowired
    public BtsController(BtsService btss) {
        this.btss = btss;
    }

    @GetMapping({"/Bts", "/Bts/"})
    public List<BtsDto> getAll(){
        return btss.getAll();
    }

    @GetMapping("/Bts/{cellid}")
    public BtsDto getByCellId(@PathVariable int cellid){
        return btss.getByCellId(cellid);
    }

    @PostMapping({"/Bts/","/Bts"})
    public List<BtsDto> getByListOfCellsId(@RequestBody CellIdDto cellsIds)
    {
        return btss.getByListOfCellsId(cellsIds.getCellid());
    }

}
