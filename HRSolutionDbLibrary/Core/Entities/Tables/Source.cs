﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
public class Source
{
	public int Id { get; set; }

	public string SourceName { get; set; }

	public bool IsActive { get; set; }

	public DateTime CreatedDate { get; set; }

	public virtual ICollection<Candidate> Candidates { get; set; } = new List<Candidate>();
}