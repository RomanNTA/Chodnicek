using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using NoBodyApi2.Services;
using System.Text;
using System.Diagnostics;
using Microsoft.Extensions.Logging;



namespace NoBodyApi2.Controllers {

    [EnableCors("AllowAll")]
    //[DisableCors]
    [Route("api/[controller]")]
    [ApiController]
    public class RepositoryController : ControllerBase {

        
        private RepositoryService service;
        private readonly ILogger<RepositoryController> _logger;

        public RepositoryController(RepositoryService service, ILogger<RepositoryController> logger) {
            this.service = service;
            //_logger = logger;

            using var loggerFactory = LoggerFactory.Create(builder => {
                builder.AddConsole();
            });
            _logger = loggerFactory.CreateLogger<RepositoryController>();
            ;
        }

        [HttpGet("headers")]
        public async Task<IEnumerable<RepositoryHeaderDto>> GetHeaders() {
            return await service.GetHeaders();
        }


        [HttpGet("detail/{uuid}")]
        public async Task<RepositoryHeaderDto> GetDetail(string uuid) {
            return await service.GetDetail(uuid);
        }

        [HttpGet("json/{uuid}")]
        public async Task<RepositoryJsonDto> GetJSON(string uuid) {
            return await service.GetJson(uuid);
        }




        [HttpPost]
        public async Task<ActionResult> PostInsert(RepositoryDto entity) {
            return (await service.PostInsert(entity)) ? Ok("OK") : NotFound("Pro uuid = " + entity.Uuid);
        }

        [HttpPut]
        public async Task<ActionResult> PutUpdate(RepositoryDto entity) {
            return await service.PutUpdate(entity) ? Ok("OK") : NotFound("Pro uuid = " + entity.Uuid);
        }

        [HttpDelete]
        public async Task<ActionResult> Delete(string uuid) {
            return await service.Delete(uuid) ? Ok(uuid) : NotFound("Pro uuid = " + uuid);
        }

    }
}


