using Microsoft.EntityFrameworkCore;

namespace NoBodyApi2 {
    
    public class NoBodyDbContext : DbContext {

        public DbSet<RepositoryDto> Repository {set; get;}

        public DbSet<BtsAdrDto> BtsAdr {set; get;}
        public DbSet<BtsValuesDto> BtsValues {set; get;}
        
        public NoBodyDbContext(DbContextOptions<NoBodyDbContext> options) : base(options) {
        }

    }
}
