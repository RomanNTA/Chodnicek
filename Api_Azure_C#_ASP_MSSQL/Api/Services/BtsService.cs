using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace NoBodyApi2.Services {
    public class BtsService {

        private NoBodyDbContext db;

        /**
         *   Konstruktor ... DI DbContext
         */
        public BtsService(NoBodyDbContext dbx) {
            this.db = dbx;
        }

        /**
         *   Popis  : Vrátí DTO podle parametru
         *   jméno  : getInfoBts
         *   @param : int cellid ... číslo BTS
         */
        public async Task<BtsDto> getInfoBts(int cellid) {

            try {
                var bts = await db.BtsValues.Include(b => b.Adr).FirstOrDefaultAsync(b => b.Cellid == cellid);
                return dbToDto(bts);

            } catch (Exception) {
                return EmptyBts();
            }
        }


        /**
         *   Popis : Vrátí List DTO podle seznamu dle parametru
         *   jméno : getListBts
         *   @param : string stringList ... string čísel oddělené čárkou. Čísla jsou id BTS.
         */
        public async Task<IEnumerable<BtsDto>> getListBts(string stringList) {

            List<BtsDto> result = new List<BtsDto>() { };
            try {
                List<int> cell = stringList
                .Split(',', System.StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Select(int.Parse)
                .ToList();

                var btsValues = await db.BtsValues
                    .Include(b => b.Adr)
                    .Where(b => cell.Contains((int)(int?)b.Cellid))
                    .ToListAsync();

                btsValues.ForEach(x => result.Add(dbToDto(x)));

            } catch (Exception) {
                return new List<BtsDto>() { EmptyBts() };
            }
            return result;
        }


        /**
         *   Popis : předevede Entiti na DTO
         *   jméno : dbToDto
         *   @param : BtsValuesDto values 
         */

        public BtsDto dbToDto(BtsValuesDto values) {

            if (values == null)
                return EmptyBts();

            return new BtsDto {
                Id = values.Id,
                Cellid = values.Cellid,
                Physcid = values.Physcid,
                Tac = values.Tac,
                Band = values.Band,
                Gsmcid = values.Gsmcid,
                Datum = values.Datum,
                Okres = values.Adr.Okres,
                Adr = values.Adr.Adresa
            };
        }

        /**
         *   Popis  : Vrátí prázdné DTO BTS
         *   jméno  : EmptyBts
         */
        public BtsDto EmptyBts() {
            BtsDto tmp = new ();
            tmp.Id = -1;
            return tmp;
        }


    }
}
