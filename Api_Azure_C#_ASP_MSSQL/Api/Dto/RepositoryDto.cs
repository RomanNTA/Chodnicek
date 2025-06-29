namespace NoBodyApi2 {
    public class RepositoryDto {

        public int? Id {
            get; set;
        }
        public string Uuid { get; set; }
        
        public string? ContextName { get; set; }

        public string? Comments {
            get; set;
        }
        public string? FileName {
            get; set;
        }
        public string? Json {
            get; set;
        }
        public string? TypeSrc {
            get; set;
        }
    }
}
