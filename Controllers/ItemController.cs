using Microsoft.AspNetCore.Mvc;
using RankingApp.Models;

namespace RankingApp.Controllers

{
    [ApiController]
    [Route("[Controller]")]
    public class ItemController : ControllerBase
    {

        private static readonly IEnumerable<ItemModel> Items = new[]
        {

            new ItemModel { Id = 1, Title = "Everything Everywhere All At Once", ImageId = 1, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 2, Title = "Spiderman Across The Spider Verse", ImageId = 2, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 3, Title = "The Lego Movie", ImageId = 3, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 4, Title = "Spirited Away", ImageId = 4, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 5, Title = "Logan", ImageId = 5, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 6, Title = "The Truman Show", ImageId = 6, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 7, Title = "Blade Runner: 2049", ImageId = 7, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 8, Title = "Dune", ImageId = 8, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 9, Title = "At Eternity's Gate", ImageId = 9, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 10, Title = "Green Book", ImageId = 10, Ranking = 0, ItemType = 1 },
            new ItemModel { Id = 11, Title = "The Greatest Showman: Reimagined", ImageId = 11, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 12, Title = "The Tortured Poets Department", ImageId = 12, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 13, Title = "Don't Forget About Me", ImageId = 13, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 14, Title = "Melodrama", ImageId = 14, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 15, Title = "Bewitched", ImageId = 15, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 16, Title = "Norman Fucking Rockwell!", ImageId = 16, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 17, Title = "Dawn FM", ImageId = 17, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 18, Title = "Night Visions", ImageId = 18, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 19, Title = "GUTS", ImageId = 19, Ranking = 0, ItemType = 2 },
            new ItemModel { Id = 20, Title = "Kid Krow", ImageId = 20, Ranking = 0, ItemType = 2 }

         };

        [HttpGet("{itemType:int}")]
        public ItemModel[] Get(int itemType)

        {

            ItemModel[] items = Items.Where(i => i.ItemType == itemType).ToArray();
            return items;

        }

    }
}