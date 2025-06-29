package cz.sliva.nobodywebapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CellIdDto {

    @JsonProperty("Cellid")
    private String cellid;

}

