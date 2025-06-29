package cz.sliva.nobodywebapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockDto {

    @JsonProperty("Id")
    public int id;

    @JsonProperty("Uuid")
    public String uuid;

    @JsonProperty("ContextName")
    public String contextName;

    @JsonProperty("Comments")
    public String comments;

    @JsonProperty("FileName")
    public String fileName;

    @JsonProperty("Json")
    public String json;

    @JsonProperty("TypeSrc")
    public String typeSrc;

}

