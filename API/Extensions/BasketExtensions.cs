
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this Basket basket)
        {
              return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                Type = item.Product.Brand,
                Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}
