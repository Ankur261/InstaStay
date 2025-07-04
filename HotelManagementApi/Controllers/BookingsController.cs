// Controllers/BookingsController.cs
using HotelManagementApi.Data;
using HotelManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.Customer)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.Customer)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            // Calculate total amount based on room price and duration
            var room = await _context.Rooms.FindAsync(booking.RoomId);
            if (room == null)
            {
                return BadRequest("Invalid Room ID");
            }

            var duration = (booking.CheckOutDate - booking.CheckInDate).Days;
            booking.TotalAmount = room.PricePerDay * duration;

            // Update room status
            room.Status = "Booked";
            _context.Entry(room).State = EntityState.Modified;

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBooking", new { id = booking.BookingId }, booking);
        }

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, Booking booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest();
            }

            // Recalculate total amount if dates or room changed
            var existingBooking = await _context.Bookings.AsNoTracking().FirstOrDefaultAsync(b => b.BookingId == id);
            if (existingBooking == null)
            {
                return NotFound();
            }

            if (existingBooking.RoomId != booking.RoomId ||
                existingBooking.CheckInDate != booking.CheckInDate ||
                existingBooking.CheckOutDate != booking.CheckOutDate)
            {
                var room = await _context.Rooms.FindAsync(booking.RoomId);
                if (room == null)
                {
                    return BadRequest("Invalid Room ID");
                }

                var duration = (booking.CheckOutDate - booking.CheckInDate).Days;
                booking.TotalAmount = room.PricePerDay * duration;
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Update room status back to Available
            var room = await _context.Rooms.FindAsync(booking.RoomId);
            if (room != null)
            {
                room.Status = "Available";
                _context.Entry(room).State = EntityState.Modified;
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.BookingId == id);
        }
    }
}