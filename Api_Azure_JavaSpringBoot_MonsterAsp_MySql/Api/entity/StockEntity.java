package cz.sliva.nobodywebapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity(name = "StockEntity")
@Table(name = "repository")
@Getter
@Setter
public class StockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String uuid;
    private String contextName;
    private String comments;
    private String fileName;

    @Lob
    private String json;

    private String typeSrc;
}
