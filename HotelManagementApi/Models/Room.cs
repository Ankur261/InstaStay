// Models/Room.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementApi.Models
{
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoomId { get; set; }

        [Required]
        [StringLength(10)]
        public string RoomNumber { get; set; }

        [StringLength(20)]
        public string Type { get; set; } // Single, Double, Deluxe

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal PricePerDay { get; set; }

        [StringLength(20)]
        public string Status { get; set; } // Available, Booked, Maintenance
    }
}