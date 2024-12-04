using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class invoiceid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SalesDetails_SalesMaster_InvoiceId",
                table: "SalesDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesMaster",
                table: "SalesMaster");

            migrationBuilder.AlterColumn<string>(
                name: "InvoiceId",
                table: "SalesMaster",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "SalesMaster",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "InvoiceId",
                table: "SalesDetails",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesMaster",
                table: "SalesMaster",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesDetails_SalesMaster_InvoiceId",
                table: "SalesDetails",
                column: "InvoiceId",
                principalTable: "SalesMaster",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SalesDetails_SalesMaster_InvoiceId",
                table: "SalesDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesMaster",
                table: "SalesMaster");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "SalesMaster");

            migrationBuilder.AlterColumn<string>(
                name: "InvoiceId",
                table: "SalesMaster",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "InvoiceId",
                table: "SalesDetails",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesMaster",
                table: "SalesMaster",
                column: "InvoiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesDetails_SalesMaster_InvoiceId",
                table: "SalesDetails",
                column: "InvoiceId",
                principalTable: "SalesMaster",
                principalColumn: "InvoiceId");
        }
    }
}
