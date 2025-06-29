using Microsoft.EntityFrameworkCore;
using NoBodyApi2;
using NoBodyApi2.Services;

var builder = WebApplication.CreateBuilder(args);


var CoorsPolicy = "AllowAll";

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddDbContext<NoBodyDbContext>(
    options => options.UseSqlServer("Server=tcp:xxxxxxxxxxxxxxxxxxxxxxxx.database.windows.net,1433;Initial Catalog=xxxxxxxxxxxxxxxxxxxxx;Persist Security Info=False;User ID=xxxxxxxx;Password=xxxxxxxxxx;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<BtsService>();
builder.Services.AddScoped<RepositoryService>();


builder.Services.AddCors(options => {
    options.AddPolicy(CoorsPolicy,
        builder => {
            builder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowAnyOrigin()      // ... nesmí být dohromady s AllowCredentials ... ale jen jeden z nich.
            //.AllowCredentials()
            ;
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        // Ignorování velikosti písmen pøi mapování JSON klíèù
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

var app = builder.Build(); 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// APLIKACE CORS POLITIKY
app.UseCors(CoorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
