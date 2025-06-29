using System.ComponentModel.DataAnnotations.Schema;

namespace NoBodyApi2 {
    public class BtsValuesDto {

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

        [ForeignKey("BtsAdr")]
        public int BtsAdrId { get; set;}

        public BtsAdrDto Adr {
            get; set;
        }

    }
}
