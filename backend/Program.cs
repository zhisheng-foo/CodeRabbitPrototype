var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ??
            new[] { "http://localhost:5173" };
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("forecast", policy =>
    {
        policy.Expire(TimeSpan.FromSeconds(20));
        policy.SetVaryByQuery(new[] { "days", "unit" });
    });
});

var app = builder.Build();
var startedAt = DateTimeOffset.UtcNow;
var weatherOptions = builder.Configuration.GetSection("Weather").Get<WeatherOptions>() ?? new WeatherOptions();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHsts();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors("frontend");
app.UseOutputCache();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";
    await next();
});

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

var api = app.MapGroup("/api");

api.MapGet("/health", () =>
{
    var uptime = DateTimeOffset.UtcNow - startedAt;
    return Results.Ok(new HealthResponse(
        "ok",
        DateTimeOffset.UtcNow,
        (int)uptime.TotalSeconds,
        Environment.Version.ToString()
    ));
});

api.MapGet("/weatherforecast", (int? days, string? unit) =>
{
    var forecastDays = Math.Clamp(days ?? weatherOptions.DefaultDays, 1, weatherOptions.MaxDays);
    var normalizedUnit = NormalizeUnit(unit);
    if (normalizedUnit is null)
    {
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["unit"] = new[] { "Unit must be 'c' or 'f'." }
        });
    }

    var items = Enumerable.Range(1, forecastDays).Select(index =>
    {
        var tempC = Random.Shared.Next(-20, 55);
        var tempF = 32 + (int)(tempC / 0.5556);
        return new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            tempC,
            tempF,
            summaries[Random.Shared.Next(summaries.Length)]
        );
    }).ToArray();

    return Results.Ok(new WeatherForecastResponse(
        DateTimeOffset.UtcNow,
        normalizedUnit,
        items
    ));
})
.WithName("GetWeatherForecast")
.CacheOutput("forecast");

api.MapGet("/weatherforecast/stats", (int? days) =>
{
    var forecastDays = Math.Clamp(days ?? weatherOptions.DefaultDays, 1, weatherOptions.MaxDays);
    var items = Enumerable.Range(1, forecastDays).Select(index =>
    {
        var tempC = Random.Shared.Next(-20, 55);
        var tempF = 32 + (int)(tempC / 0.5556);
        return new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            tempC,
            tempF,
            summaries[Random.Shared.Next(summaries.Length)]
        );
    }).ToArray();

    var stats = ForecastStats.From(items);
    return Results.Ok(stats);
})
.WithName("GetWeatherStats");

app.Run();

static string? NormalizeUnit(string? unit)
{
    if (string.IsNullOrWhiteSpace(unit)) return "c";
    var u = unit.Trim().ToLowerInvariant();
    return u is "c" or "f" ? u : null;
}

record WeatherForecast(DateOnly Date, int TemperatureC, int TemperatureF, string? Summary);

record WeatherForecastResponse(DateTimeOffset GeneratedAt, string Unit, WeatherForecast[] Items);

record HealthResponse(string Status, DateTimeOffset TimeUtc, int UptimeSeconds, string Runtime);

record WeatherOptions
{
    public int DefaultDays { get; init; } = 5;
    public int MaxDays { get; init; } = 14;
}

record ForecastStats(int Count, double AvgC, int MinC, int MaxC, double AvgF, int MinF, int MaxF)
{
    public static ForecastStats From(WeatherForecast[] items)
    {
        if (items.Length == 0)
        {
            return new ForecastStats(0, 0, 0, 0, 0, 0, 0);
        }

        var avgC = items.Average(x => x.TemperatureC);
        var avgF = items.Average(x => x.TemperatureF);
        var minC = items.Min(x => x.TemperatureC);
        var maxC = items.Max(x => x.TemperatureC);
        var minF = items.Min(x => x.TemperatureF);
        var maxF = items.Max(x => x.TemperatureF);

        return new ForecastStats(items.Length, Math.Round(avgC, 1), minC, maxC, Math.Round(avgF, 1), minF, maxF);
    }
}
