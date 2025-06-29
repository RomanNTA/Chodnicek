package cz.sliva.nobodywebapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "BtsAdrEntity")
@Table(name = "bts_adr")
@Getter
@Setter
public class BtsAdrEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String okres;
    private String adresa;

}
