using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace RankingApp.Controllers
{
    [ApiController]
    [Route("api/tierlist")]
    public class TierlistController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string PHP_API_BASE = "http://localhost/api"; // MAMP Apache on port 80

        public TierlistController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(PHP_API_BASE);
        }

        [HttpGet("read.php")]
        public async Task<IActionResult> Read()
        {
            try
            {
                var response = await _httpClient.GetAsync("tierlist/read.php");
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, 
                        new { success = false, message = $"PHP API returned status code {response.StatusCode}" });
                }
                var content = await response.Content.ReadAsStringAsync();
                return Content(content, "application/json");
            }
            catch (Exception ex)
            {
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

                var response = await _httpClient.PostAsync(
                    "tierlist/create.php",
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
                    "tierlist/delete.php",
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