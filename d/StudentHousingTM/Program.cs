var builder = WebApplication.CreateBuilder(args);

// Add MVC + API controllers
builder.Services.AddControllersWithViews();

// Allow Next.js to call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
StudentHousingTM_DAL.DBHelper.ConnectionString= app.Configuration.GetConnectionString("DefaultConnection");



app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Enable CORS before routing
app.UseCors("AllowNextJs");

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// This enables /api/... routes
app.MapControllers();

app.Run();