using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace NoBodyApi2.Services {
    public class RepositoryService {

        private NoBodyDbContext db;
        private readonly ILogger<RepositoryService> _logger;

        /**
         *   Konstruktor ... DI DbContext + logger
         */
        public RepositoryService(NoBodyDbContext db, ILogger<RepositoryService> logger) {
            this.db = db;
            _logger = logger;
        }


        public async Task<IEnumerable<RepositoryHeaderDto>> GetHeaders() {
            try {
                return await db.Repository
                .Select( values => headerToDto(values))
                .ToListAsync();
            } catch (Exception) {
                return null;
            }
        }

        public async Task<RepositoryHeaderDto> GetDetail(string uuid) {

            try {
                var tmp = await db.Repository
                .Where(x => x.Uuid == uuid)
                .Select(values => headerToDto(values))
                .FirstOrDefaultAsync();
                return tmp == null ? new RepositoryHeaderDto() : tmp;

            } catch (Exception e) {
                _logger.LogError(e, "GetDetail: Chyba při načítání detailu repozitáře pro UUID: {Uuid}", uuid);
                return null;
            }
        }

        public async Task<RepositoryJsonDto> GetJson(string uuid) {

            try {
                var tmp = await db.Repository
                .Where(x => x.Uuid == uuid)
                .Select(values => new RepositoryJsonDto { 
                    json = values.Json
                }).FirstOrDefaultAsync();
                return tmp == null ? new RepositoryJsonDto() : tmp;

            } catch (Exception e) {
                _logger.LogError(e, "GetJson: Chyba při načítání detailu repozitáře pro UUID: {Uuid}", uuid);
                return null;
            }
        }

        public async Task<Boolean> PostInsert(RepositoryDto entity) {

            _logger.LogInformation("PostInsert: ", entity);


            if (entity == null || entity.Uuid == "") {
                return false;
            }
            try {
                db.Repository.Add(entity);
                db.SaveChanges();
                return true;
            } catch (Exception) {
                return false;
            }
        }

        public async Task<Boolean> PutUpdate(RepositoryDto entity) {

            if (entity == null || entity.Uuid == "") {
                return false;
            }

            var re = await db.Repository.FirstOrDefaultAsync(x => x.Uuid == entity.Uuid);
            if (re == null) {
                return false;
            }

            try {
                re.Uuid = entity.Uuid;
                re.ContextName = entity.ContextName;
                re.Comments = entity.Comments;
                re.FileName = entity.FileName;
                re.Json = entity.Json;
                re.TypeSrc = entity.TypeSrc;
                db.SaveChanges();
                return true;

            } catch (Exception) {
                return false;
            }

        }



        public async Task<Boolean> Delete(string uuid ) {

            if (uuid == null || uuid.Length == 0) {
                return false;
            }

            try {
                // musí ho najít !
                var re = await db.Repository.FirstOrDefaultAsync(x => x.Uuid == uuid);
                if (re == null) {
                    return false;
                }
                db.Remove(re);
                db.SaveChanges();
                return true;

            } catch (Exception) {
                return false;
            }
        }


        private static RepositoryHeaderDto headerToDto(RepositoryDto values) {

            return new RepositoryHeaderDto () {
                Uuid = values.Uuid,
                ContextName = values.ContextName,
                Comments = values.Comments,
                FileName = values.FileName,
                TypeSrc = values.TypeSrc
            };
        }

    }
}
