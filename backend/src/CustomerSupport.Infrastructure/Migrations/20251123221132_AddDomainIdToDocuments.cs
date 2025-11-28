using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CustomerSupport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDomainIdToDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DomainId",
                table: "documents",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "idx_documents_domain_id",
                table: "documents",
                column: "DomainId");

            migrationBuilder.AddForeignKey(
                name: "FK_documents_domains_DomainId",
                table: "documents",
                column: "DomainId",
                principalTable: "domains",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_documents_domains_DomainId",
                table: "documents");

            migrationBuilder.DropIndex(
                name: "idx_documents_domain_id",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "DomainId",
                table: "documents");
        }
    }
}
