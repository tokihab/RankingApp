using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace RankingApp.Controllers
{
    [ApiController]
    [Route("api/tierlist")]
    public class TierlistController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string PHP_API_BASE = "http://localhost"; // MAMP Apache on port 80

        public TierlistController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("read.php")]
        public async Task<IActionResult> Read()
        {
            try
            {
                var url = $"{PHP_API_BASE}/api/tierlist/read.php";
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

        [HttpPost("create.php")]
        public async Task<IActionResult> Create([FromBody] object data)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    Encoding.UTF8,
                    "application/json");

                var url = $"{PHP_API_BASE}/api/tierlist/create.php";
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

        [HttpPost("delete.php")]
        public async Task<IActionResult> Delete([FromBody] object data)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync(
                    $"{PHP_API_BASE}/api/tierlist/delete.php",
                    content);

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, 
                        new { success = false, message = $"PHP API returned status code {response.StatusCode}" });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Content(responseContent, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}