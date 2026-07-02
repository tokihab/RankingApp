using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace RankingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string PHP_API_BASE = "http://localhost:80"; // MAMP Apache on port 80

        public ItemController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Removed .php from decorator
        [HttpGet("read")]
        public async Task<IActionResult> Read([FromQuery] int? tier_list_id)
        {
            try
            {
                var queryParams = tier_list_id.HasValue ? $"?tier_list_id={tier_list_id}" : "";
                // Pointed to tierapp
                var url = $"{PHP_API_BASE}/tierapp/item/read.php{queryParams}";
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

        // Removed .php from decorator
        [HttpPost("create")]
        public async Task<IActionResult> Create()
        {
            try
            {
                var requestContent = new MultipartFormDataContent();
                
                foreach (var formKey in Request.Form.Keys)
                {
                    requestContent.Add(new StringContent(Request.Form[formKey].ToString()), formKey);
                }
                
                foreach (var file in Request.Form.Files)
                {
                    var streamContent = new StreamContent(file.OpenReadStream());
                    streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
                    requestContent.Add(streamContent, "image", file.FileName);
                }
                
                // Pointed to tierapp
                var url = $"{PHP_API_BASE}/tierapp/item/create.php";
                Console.WriteLine($"Attempting to call PHP API: {url}");
                
                var response = await _httpClient.PostAsync(url, requestContent);

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

        // Removed .php from decorator
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] object data)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    Encoding.UTF8,
                    "application/json");

                // Pointed to tierapp
                var url = $"{PHP_API_BASE}/tierapp/item/update.php";
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

        // Removed .php from decorator
        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] object data)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(data),
                    Encoding.UTF8,
                    "application/json");

                // Pointed to tierapp
                var url = $"{PHP_API_BASE}/tierapp/item/delete.php";
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