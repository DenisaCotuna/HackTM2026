using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers + JSON ──────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // camelCase for Next.js (e.g. propertyID → propertyId on the JS side)
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        // Don't blow up on null reference types
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// ── CORS ────────────────────────────────────────────────────────────────────
// Allow Next.js dev server and production domain
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",   // Next.js dev
                "https://your-production-domain.com"  // swap before demo
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── Swagger (useful during hackathon for manual testing) ────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Middleware pipeline ──────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("NextJsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
