namespace API.RequestHelpers
{
  public class MetaData
  {
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }

    // items in the list
    public int TotalCount { get; set; }
  }
}
