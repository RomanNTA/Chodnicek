using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoBodyApi2.Services;

namespace NoBodyApi2.Controllers {

    [EnableCors("AllowAll")]
    //[DisableCors]
    [Route("api/[controller]")]
    [ApiController]
    public class BtsController : Controller {

        private BtsService btsService;

        public BtsController(BtsService btsServiceX) {
            this.btsService = btsServiceX;
        }

        [HttpGet]
        public async Task<BtsDto> GetOneBts( int cellId) {
            return await btsService.getInfoBts(cellId);
        }


        [HttpPost]
        public async Task<IEnumerable<BtsDto>> GetListBts(ListCellsDto dto) {
            return await btsService.getListBts(dto.Cellid);
        }





    }
}
