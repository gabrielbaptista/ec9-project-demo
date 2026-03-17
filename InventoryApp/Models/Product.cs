using System;
using System.ComponentModel.DataAnnotations;

namespace InventoryApp.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        [Display(Name = "Nome")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "A categoria é obrigatória.")]
        [StringLength(50, ErrorMessage = "A categoria não pode exceder 50 caracteres.")]
        [Display(Name = "Categoria")]
        public string Category { get; set; } = string.Empty;

        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(0, int.MaxValue, ErrorMessage = "A quantidade deve ser um número positivo.")]
        [Display(Name = "Quantidade")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "A unidade de medida é obrigatória.")]
        [StringLength(20, ErrorMessage = "A unidade não pode exceder 20 caracteres.")]
        [Display(Name = "Unidade")]
        public string Unit { get; set; } = string.Empty;

        [Required(ErrorMessage = "A data de fabricação é obrigatória.")]
        [DataType(DataType.Date)]
        [Display(Name = "Data de Fabricação")]
        public DateTime ManufactureDate { get; set; }

        [Required(ErrorMessage = "A data de validade é obrigatória.")]
        [DataType(DataType.Date)]
        [Display(Name = "Data de Validade")]
        public DateTime ExpiryDate { get; set; }

        [StringLength(255, ErrorMessage = "As observações não podem exceder 255 caracteres.")]
        [Display(Name = "Observações")]
        public string? Notes { get; set; }

        // Computed helper properties
        public bool IsExpired => DateTime.Today > ExpiryDate;

        public bool IsExpiringSoon => !IsExpired && (ExpiryDate - DateTime.Today).TotalDays <= 7;

        public int DaysUntilExpiry => (ExpiryDate - DateTime.Today).Days;
    }
}
