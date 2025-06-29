namespace NoBodyApi2 {
    public class BtsDto {
        public int Id {
            get; set;
        }
        public int? Cellid { get; set; }
        
        public int? Physcid { get; set; }

        public int? Tac {
            get; set;
        }
        public int? Band {
            get; set;
        }
        public int? Gsmcid {
            get; set;
        }
        public DateOnly? Datum {
            get; set;
        }

        public string Okres {
            get; set;
        }
        public string Adr {
            get; set;
        }

    }
}


