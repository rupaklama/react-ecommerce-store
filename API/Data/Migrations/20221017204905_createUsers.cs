using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    public partial class createUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2fc02f73-cf36-452f-9c94-a6a4eed1e8ae");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "474766fd-f79d-4d48-b241-4bef3391b06c");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "212772ca-445e-4ab1-9e45-7e2e00afd00d", "7feb9ca0-374f-4340-b7e9-5a7c71c5a465", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "f7600c50-b452-49ca-a9e9-30ef6290fe4f", "2fb4dec1-624f-498a-87d0-1bee6f43daa5", "Member", "MEMBER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "212772ca-445e-4ab1-9e45-7e2e00afd00d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f7600c50-b452-49ca-a9e9-30ef6290fe4f");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "2fc02f73-cf36-452f-9c94-a6a4eed1e8ae", "08d45683-6235-4842-93f2-31fbbbc319d1", "Member", "MEMBER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "474766fd-f79d-4d48-b241-4bef3391b06c", "fdba7718-18c3-4bd5-9624-719a1e591ab2", "Admin", "ADMIN" });
        }
    }
}
