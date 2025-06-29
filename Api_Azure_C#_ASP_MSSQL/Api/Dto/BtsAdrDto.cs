namespace NoBodyApi2 {
    public class BtsAdrDto {

        public int Id {
            get; set;
        }
        public string? Okres { get; set; }
        
        public string? Adresa { get; set; }

        public ICollection<BtsValuesDto> BtsValues {get; set;}

    }
}
