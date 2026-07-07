using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace RankingApp.Controllers
{
    [ApiController]
    [Route("api/tierlist")]
    public class TierlistController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string PHP_API_BASE = "http://127.0.0.1:8000";

        public TierlistController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("read")]
        public async Task<IActionResult> Read()
        {
            try
            {
                // Updated to point to tierapp instead of api
                var url = $"{PHP_API_BASE}/tierapp/tierlist/read.php";
                Console.WriteLine($"Attempting to call PHP API: {url}");
                
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"PHP API error response: {errorContent}");
                    return StatusCode((int)response.StatusCode, 
                        new { success = false, message = $"PHP API returned status code {response.StatusCode}: {errorContent}" });
                }
                var content = await response.Content.ReadAsStringAsync();
                return Content(content, "application/json");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception calling PHP API: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] object data)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    Encoding.UTF8,
                    "application/json");

                // Updated to point to tierapp instead of api
                var url = $"{PHP_API_BASE}/tierapp/tierlist/create";
                Console.WriteLine($"Attempting to call PHP API: {url}");
                
                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"PHP API error response: {errorContent}");
                    return StatusCode((int)response.StatusCode, 
                        new { success = false, message = $"PHP API returned status code {response.StatusCode}: {errorContent}" });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Content(responseContent, "application/json");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception calling PHP API: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] object data)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    Encoding.UTF8,
                    "application/json");

                // Updated to point to tierapp instead of api
                var url = $"{PHP_API_BASE}/tierapp/tierlist/delete.php";
                Console.WriteLine($"Attempting to call PHP API: {url}");
                
                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"PHP API error response: {errorContent}");
                    return StatusCode((int)response.StatusCode, 
                        new { success = false, message = $"PHP API returned status code {response.StatusCode}: {errorContent}" });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Content(responseContent, "application/json");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception calling PHP API: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}