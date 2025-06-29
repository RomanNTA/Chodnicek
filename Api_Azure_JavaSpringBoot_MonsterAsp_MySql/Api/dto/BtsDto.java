package cz.sliva.nobodywebapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BtsDto {

    @JsonProperty("id")
    private int id;

    @JsonProperty("cellid")
    private int cellid;

    @JsonProperty("physcid")
    private int physcid;

    @JsonProperty("tac")
    private int tac;

    @JsonProperty("band")
    private int band;

    @JsonProperty("gsmcid")
    private int gsmcid;

    @JsonProperty("datum")
    private LocalDate datum;

    @JsonProperty("okres")
    private String okres;

    @JsonProperty("adresa")
    private String adresa;

    @JsonProperty("adrId")
    private int adrId;
}
