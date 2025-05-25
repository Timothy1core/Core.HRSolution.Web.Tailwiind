using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComponentServiceLibrary.Dtos
{
	public class DataTableResponseDto<T>
	{
		public string? Draw { get; set; }
		public int RecordsTotal { get; set; }
		public int RecordsFiltered { get; set; }
		public List<T> Data { get; set; } = [];
	}
}
