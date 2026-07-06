# RankingApp

RankingApp is a tier list / ranking app built to practice a deliberately unusual full stack: React on the front end, ASP.NET Core as the routing layer, PHP with PDO for database access, and MySQL running through MAMP.

The project started as the default Visual Studio weather template and grew into a tier list app with create, upload, edit, delete, and save flows.

## Architecture

- React handles the UI and user interactions.
- ASP.NET Core acts as the API gateway and forwards requests to the PHP layer.
- PHP uses PDO to talk to MySQL.
- MAMP hosts MySQL and serves uploaded images from Apache.

This stack is intentionally more complicated than it needs to be. The goal was practice, not elegance.

## What the app does

- Create a tier list by name.
- Open the ranking grid for that list.
- Upload images from your computer.
- Remove an item if it was uploaded by mistake.
- Drag items into ranked positions.
- Save the finished list and return to it later.
- Edit or delete existing tier lists from the menu.

## Project Structure

- `ClientApp/` - React frontend
- `Controllers/` - ASP.NET Core controllers that proxy to PHP
- `tierapp/` - PHP app with database and upload logic
- `tierapp/config/Database.php` - PDO connection to MySQL
- `tierapp/item/` - item create/read/update/delete endpoints
- `tierapp/tierlist/` - tier list create/read/delete endpoints

## Local Run

1. Start MAMP first.
2. Make sure Apache is on port `80` and MySQL is on `3306`.
3. Run the .NET backend from the repository root:

```powershell
dotnet run
```

4. Run the React frontend from `ClientApp`:

```powershell
cd ClientApp
npm start
```

5. Open the React app in the browser at the port shown by the dev server.

## Notes

- Uploaded images are stored in `tierapp/item/uploads`.
- The item reader expects both `item_type` and `tier_list_id`.
- If the UI shows no images, restart both the .NET and React dev servers.
- The browser may warn about the ASP.NET dev certificate in local development.

## Why it exists

This project was mainly a learning exercise for:

- ASP.NET Core routing and controllers
- PHP PDO and MySQL integration
- file upload handling
- proxying between a React frontend and a separate backend stack

It is a normal tier list app, except the requests take the scenic route.