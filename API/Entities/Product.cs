namespace API.Entities

// In C# term entity is commonly related to database representation of the table - an object 
// and should contain an Id attribute.

{
  public class Product
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public long Price { get; set; }
    public string PictureUrl { get; set; }
    public string Type { get; set; }
    public string Brand { get; set; }
    public int QuantityInStock { get; set; }
  }
}
