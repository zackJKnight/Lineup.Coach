using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Lineup.Coach.Persistence.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PositionPreferenceRank",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PositionPreferenceRank", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    TeamId = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.TeamId);
                });

            migrationBuilder.CreateTable(
                name: "Game",
                columns: table => new
                {
                    GameId = table.Column<string>(nullable: false),
                    PlayDate = table.Column<DateTime>(nullable: false),
                    BenchCount = table.Column<int>(nullable: false),
                    MaxPlayersOnFieldCount = table.Column<int>(nullable: false),
                    AvailablePlayerCount = table.Column<int>(nullable: false),
                    OpponentTeamId = table.Column<string>(nullable: true),
                    IsHomeGame = table.Column<bool>(nullable: false),
                    RefereeName = table.Column<string>(nullable: true),
                    StartingPositionsPerPlayerCount = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Game", x => x.GameId);
                    table.ForeignKey(
                        name: "FK_Game_Teams_OpponentTeamId",
                        column: x => x.OpponentTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    PlacementScore = table.Column<int>(nullable: false),
                    PositionPreferenceRankId = table.Column<Guid>(nullable: true),
                    TeamId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Player_PositionPreferenceRank_PositionPreferenceRankId",
                        column: x => x.PositionPreferenceRankId,
                        principalTable: "PositionPreferenceRank",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Player_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Period",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Number = table.Column<int>(nullable: false),
                    DurationInMinutes = table.Column<int>(nullable: false),
                    GameId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Period", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Period_Game_GameId",
                        column: x => x.GameId,
                        principalTable: "Game",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Position",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PositionType = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    PeriodId = table.Column<Guid>(nullable: false),
                    StartingPlayerId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Position", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Position_Period_PeriodId",
                        column: x => x.PeriodId,
                        principalTable: "Period",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Position_Player_StartingPlayerId",
                        column: x => x.StartingPlayerId,
                        principalTable: "Player",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Game_OpponentTeamId",
                table: "Game",
                column: "OpponentTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Period_GameId",
                table: "Period",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Player_PositionPreferenceRankId",
                table: "Player",
                column: "PositionPreferenceRankId");

            migrationBuilder.CreateIndex(
                name: "IX_Player_TeamId",
                table: "Player",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Position_PeriodId",
                table: "Position",
                column: "PeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_Position_StartingPlayerId",
                table: "Position",
                column: "StartingPlayerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Position");

            migrationBuilder.DropTable(
                name: "Period");

            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropTable(
                name: "Game");

            migrationBuilder.DropTable(
                name: "PositionPreferenceRank");

            migrationBuilder.DropTable(
                name: "Teams");
        }
    }
}
