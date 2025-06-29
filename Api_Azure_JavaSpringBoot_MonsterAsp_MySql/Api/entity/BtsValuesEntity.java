package cz.sliva.nobodywebapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity(name = "BtsValuesEntity")
@Table(name = "bts_values")
@Getter
@Setter
public class BtsValuesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

//    @ManyToOne   ... Anotace pro vazbu
//    @OneToMany   ... Dava se nad
//    @OneToOne
//    @ManyToMany

    private int cellid;
    private int physcid;
    private int tac;
    private int band;
    private int gsmcid;
    private LocalDate datum;

    @Column(name = "adr_id")
    private int adrId;

    @ManyToOne
    private BtsAdrEntity btsAdrId;

}
/*
Tabulka v databazi
CREATE TABLE `bts_values` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`adr_id` INT(11) NOT NULL,
	`band` INT(11) NOT NULL,
	`bsmcid` INT(11) NOT NULL,
	`cellid` INT(11) NOT NULL,
	`datum` DATE NULL DEFAULT NULL,
	`physcid` INT(11) NOT NULL,
	`tac` INT(11) NOT NULL,
	`bts_adr_id_id` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FKbvoh4ubqafwmiklrf2jm4v8w6` (`bts_adr_id_id`) USING BTREE,
	CONSTRAINT `FKbvoh4ubqafwmiklrf2jm4v8w6` FOREIGN KEY (`bts_adr_id_id`) REFERENCES `myfreesqldbnobodyname`.`bts_adr` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
*/















