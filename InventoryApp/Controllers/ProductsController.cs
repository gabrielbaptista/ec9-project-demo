using InventoryApp.Data;
using InventoryApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryApp.Controllers
{
    public class ProductsController : Controller
    {
        private readonly InventoryDbContext _context;

        public ProductsController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: Products
        public async Task<IActionResult> Index(string? searchString, string? filterStatus)
        {
            var products = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                products = products.Where(p =>
                    p.Name.Contains(searchString) ||
                    p.Category.Contains(searchString));
            }

            var list = await products.OrderBy(p => p.ExpiryDate).ToListAsync();

            if (filterStatus == "expired")
                list = list.Where(p => p.IsExpired).ToList();
            else if (filterStatus == "expiring")
                list = list.Where(p => p.IsExpiringSoon).ToList();

            ViewBag.SearchString = searchString;
            ViewBag.FilterStatus = filterStatus;
            return View(list);
        }

        // GET: Products/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FirstOrDefaultAsync(m => m.Id == id);
            if (product == null) return NotFound();

            return View(product);
        }

        // GET: Products/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Products/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Category,Quantity,Unit,ManufactureDate,ExpiryDate,Notes")] Product product)
        {
            if (ModelState.IsValid)
            {
                if (product.ExpiryDate <= product.ManufactureDate)
                {
                    ModelState.AddModelError("ExpiryDate", "A data de validade deve ser posterior à data de fabricação.");
                    return View(product);
                }

                _context.Add(product);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Produto cadastrado com sucesso!";
                return RedirectToAction(nameof(Index));
            }
            return View(product);
        }

        // GET: Products/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            return View(product);
        }

        // POST: Products/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Category,Quantity,Unit,ManufactureDate,ExpiryDate,Notes")] Product product)
        {
            if (id != product.Id) return NotFound();

            if (ModelState.IsValid)
            {
                if (product.ExpiryDate <= product.ManufactureDate)
                {
                    ModelState.AddModelError("ExpiryDate", "A data de validade deve ser posterior à data de fabricação.");
                    return View(product);
                }

                try
                {
                    _context.Update(product);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Produto atualizado com sucesso!";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProductExists(product.Id)) return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(product);
        }

        // GET: Products/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FirstOrDefaultAsync(m => m.Id == id);
            if (product == null) return NotFound();

            return View(product);
        }

        // POST: Products/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Produto removido com sucesso!";
            }
            return RedirectToAction(nameof(Index));
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
