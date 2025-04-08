using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Graph.Models;

namespace OutlookServiceLibrary
{
	public class GraphService
	{

		private readonly GraphServiceClient _graphClient;

		public GraphService(string tenantId, string clientId, string clientSecret)
		{
			var clientSecretCredential = new ClientSecretCredential(tenantId, clientId, clientSecret);
			_graphClient = new GraphServiceClient(clientSecretCredential);
		}

		public async Task<List<string>> GetDistributionGroupEmails(string distroEmail)
		{
			var emails = new List<string>();

			try
			{
				// Step 1: Get the Group by Email
				var groups = await _graphClient.Groups
					.GetAsync((requestConfiguration) =>
					{
						requestConfiguration.QueryParameters.Filter = $"mail eq '{distroEmail}'";
					});

				var group = groups?.Value?.FirstOrDefault();
				if (group == null)
				{
					Console.WriteLine($"Group not found for email: {distroEmail}");
					return emails;
				}

				// Step 2: Get Group Members
				var members = await _graphClient.Groups[group.Id].Members.GetAsync();
				if (members?.Value == null) return emails;

				// Step 3: Extract Emails
				foreach (var member in members.Value)
				{
					switch (member)
					{
						case User user when !string.IsNullOrEmpty(user.Mail):
							emails.Add(user.Mail);
							break;
						case OrgContact contact when !string.IsNullOrEmpty(contact.Mail):
							emails.Add(contact.Mail);
							break;
					}
				}
			}
			catch (Microsoft.Graph.ServiceException ex)
			{
				Console.WriteLine($"Graph API error: - {ex.Message}");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Unexpected error: {ex.Message}");
			}

			return emails;
		}


		public async Task<string> GetUserIdByEmailAsync(string email)
		{
			try
			{
				var users = await _graphClient.Users
					.GetAsync((requestConfiguration) =>
					{
						requestConfiguration.QueryParameters.Filter = $"mail eq '{email}'";
						requestConfiguration.QueryParameters.Select = new string[] { "id", "displayName", "mail" };
					});

				var user = users?.Value?.Count > 0 ? users.Value[0] : null;
				return user?.Id;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving user: {ex.Message}");
				return null;
			}
		}

		public async Task SendEmailAsync(string fromUserEmail, string recipientEmail, string subject, string body)
		{
			try
			{
				var message = new Message
				{
					Subject = subject,
					Body = new ItemBody
					{
						ContentType = BodyType.Html,
						Content = body
					},
					ToRecipients = new List<Recipient>
					{
						new Recipient
						{
							EmailAddress = new EmailAddress
							{
								Address = recipientEmail
							}
						}
					}
				};

				await _graphClient.Users[fromUserEmail].SendMail.PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
				{
					Message = message,
					SaveToSentItems = true
				});

				Console.WriteLine("Email sent successfully.");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error sending email: {ex.Message}");
				throw;
			}
		}

		public async Task<List<Message>> GetEmailsByDistroEmailAsync(string distroEmail, string emailAddress, int maxEmails = 20)
		{
			try
			{
				List<Message> allMessages = new List<Message>();

				// Step 1: Retrieve emails from the distribution group
				var fromUserEmails = new List<string>();

				try
				{
					// Step 1: Get the Group by Email
					var groups = await _graphClient.Groups
						.GetAsync((requestConfiguration) =>
						{
							requestConfiguration.QueryParameters.Filter = $"mail eq '{distroEmail}'";
						});

					var group = groups?.Value?.FirstOrDefault();
					if (group == null)
					{
						Console.WriteLine($"Group not found for email: {distroEmail}");
						return allMessages; // Return empty list if no group is found
					}

					// Step 2: Get Group Members
					var members = await _graphClient.Groups[group.Id].Members.GetAsync();
					if (members?.Value == null || !members.Value.Any())
					{
						Console.WriteLine($"No members found in the distribution group: {distroEmail}");
						return allMessages;
					}

					// Step 3: Extract Emails
					foreach (var member in members.Value)
					{
						if (member is User user && !string.IsNullOrEmpty(user.Mail))
						{
							fromUserEmails.Add(user.Mail);
						}
						else if (member is OrgContact contact && !string.IsNullOrEmpty(contact.Mail))
						{
							fromUserEmails.Add(contact.Mail);
						}
					}
				}
				catch (Microsoft.Graph.ServiceException ex)
				{
					Console.WriteLine($"Graph API error: {ex.Message}");
					return allMessages;
				}
				catch (Exception ex)
				{
					Console.WriteLine($"Unexpected error: {ex.Message}");
					return allMessages;
				}

				if (!fromUserEmails.Any())
				{
					Console.WriteLine($"No emails found for distribution group: {distroEmail}");
					return allMessages;
				}

				// Step 4: Fetch emails asynchronously for each user from both Inbox and Sent Items
				var emailTasks = fromUserEmails.Select(async fromUserEmail =>
				{
					try
					{
						List<Message> userMessages = new List<Message>();

						// Fetch Inbox messages
						var inboxMessagesResponse = await _graphClient.Users[fromUserEmail]
							.MailFolders["inbox"].Messages
							.GetAsync((requestConfiguration) =>
							{
								requestConfiguration.QueryParameters.Select = new[]
								{
							"id", "subject", "from", "toRecipients", "ccRecipients", "receivedDateTime", "bodyPreview"
								};
								requestConfiguration.QueryParameters.Search = $"\"from:{emailAddress} to:{fromUserEmail}\"";
								requestConfiguration.QueryParameters.Top = maxEmails;
							});

						var sortedInboxMessages = inboxMessagesResponse?.Value
							.OrderByDescending(m => m.ReceivedDateTime)
							.ToList();

						if (sortedInboxMessages != null)
						{
							var filteredInboxMessages = sortedInboxMessages.Where(msg =>
								(msg.From?.EmailAddress?.Address == fromUserEmail &&
								 msg.ToRecipients?.Any(to => to.EmailAddress?.Address == emailAddress) == true )
								||
								(msg.From?.EmailAddress?.Address == emailAddress &&
							msg.ToRecipients?.Any(to => to.EmailAddress?.Address == fromUserEmail) == true)
							).ToList();

							userMessages.AddRange(filteredInboxMessages);
						}

						var sentMessagesResponse = await _graphClient.Users[fromUserEmail]
							.MailFolders["sentitems"].Messages
							.GetAsync((requestConfiguration) =>
							{
								requestConfiguration.QueryParameters.Select = new[]
								{
									"id", "subject", "from", "toRecipients", "ccRecipients", "receivedDateTime", "bodyPreview"
								};
								requestConfiguration.QueryParameters.Search = $"\"from:{fromUserEmail} to:{emailAddress}\"";
								requestConfiguration.QueryParameters.Top = maxEmails;
							});

						// Order by receivedDateTime in descending order after retrieval
						var sortedMessages = sentMessagesResponse?.Value
							.OrderByDescending(m => m.ReceivedDateTime)
							.ToList();

						if (sortedMessages != null)
						{
							var filteredSentMessages = sortedMessages.Where(msg =>
								(msg.From?.EmailAddress?.Address == fromUserEmail &&
								 msg.ToRecipients?.Any(to => to.EmailAddress?.Address == emailAddress) == true)
								||
								(msg.From?.EmailAddress?.Address == emailAddress &&
								 msg.ToRecipients?.Any(to => to.EmailAddress?.Address == fromUserEmail) == true)
							).ToList();

							userMessages.AddRange(filteredSentMessages);
						}

						return userMessages
							.OrderByDescending(m => m.ReceivedDateTime)
							.ToList(); ;
					}
					catch (Exception ex)
					{
						Console.WriteLine($"Error retrieving emails for user {fromUserEmail}: {ex.Message}");
						return new List<Message>();
					}
				});

				var results = await Task.WhenAll(emailTasks);
				allMessages.AddRange(results.SelectMany(r => r));

				return allMessages;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving emails: {ex.Message}");
				return new List<Message>();
			}
		}



		public async Task CreateCalendarEventAsync(string fromUserEmail, string subject, string body, DateTime startTime, DateTime endTime, string timeZone, List<string> attendeesEmails)
		{
			try
			{
				var eventAttendees = new List<Attendee>();

				foreach (var email in attendeesEmails)
				{
					eventAttendees.Add(new Attendee
					{
						EmailAddress = new EmailAddress { Address = email },
						Type = AttendeeType.Required
					});
				}

				var newEvent = new Event
				{
					Subject = subject,
					Body = new ItemBody
					{
						ContentType = BodyType.Html,
						Content = body
					},
					Start = new DateTimeTimeZone
					{
						DateTime = startTime.ToString("yyyy-MM-ddTHH:mm:ss"),
						TimeZone = timeZone
					},
					End = new DateTimeTimeZone
					{
						DateTime = endTime.ToString("yyyy-MM-ddTHH:mm:ss"),
						TimeZone = timeZone
					},
					Location = new Location
					{
						DisplayName = "Online Meeting"
					},
					Attendees = eventAttendees
				};

				await _graphClient.Users[fromUserEmail].Calendar.Events.PostAsync(newEvent);

				Console.WriteLine("Calendar event created successfully.");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error creating calendar event: {ex.Message}");
				throw;
			}
		}

		public async Task<List<Event>> GetCalendarEventsByDistroEmailAsync(string distroEmail, string attendeeEmail)
		{
			try
			{
				List<Event> allEvents = new List<Event>();
				var fromUserEmails = new List<string>();

				try
				{
					// Step 1: Get the Group by Email
					var groups = await _graphClient.Groups
						.GetAsync((requestConfiguration) =>
						{
							requestConfiguration.QueryParameters.Filter = $"mail eq '{distroEmail}'";
						});

					var group = groups?.Value?.FirstOrDefault();
					if (group == null)
					{
						Console.WriteLine($"Group not found for email: {distroEmail}");
						return allEvents; // Return empty list if no group is found
					}

					// Step 2: Get Group Members
					var members = await _graphClient.Groups[group.Id].Members.GetAsync();
					if (members?.Value == null || !members.Value.Any())
					{
						Console.WriteLine($"No members found in the distribution group: {distroEmail}");
						return allEvents;
					}

					// Step 3: Extract Emails
					foreach (var member in members.Value)
					{
						if (member is User user && !string.IsNullOrEmpty(user.Mail))
						{
							fromUserEmails.Add(user.Mail);
						}
						else if (member is OrgContact contact && !string.IsNullOrEmpty(contact.Mail))
						{
							fromUserEmails.Add(contact.Mail);
						}
					}
				}
				catch (Microsoft.Graph.ServiceException ex)
				{
					Console.WriteLine($"Graph API error: {ex.Message}");
					return allEvents;
				}
				catch (Exception ex)
				{
					Console.WriteLine($"Unexpected error: {ex.Message}");
					return allEvents;
				}

				if (!fromUserEmails.Any())
				{
					Console.WriteLine($"No emails found for distribution group: {distroEmail}");
					return allEvents;
				}

				// Step 4: Fetch calendar events asynchronously for each user
				var eventTasks = fromUserEmails.Select(async fromUserEmail =>
				{
					try
					{
						var events = await _graphClient.Users[fromUserEmail].Calendar.Events
							.GetAsync((requestConfiguration) =>
							{
								requestConfiguration.QueryParameters.Select = new string[]
								{
							"id", "subject", "body", "start", "end", "location", "organizer", "attendees", "onlineMeeting", "createddatetime"
								};
								requestConfiguration.QueryParameters.Orderby = new string[] { "start/dateTime asc" };
							});

						if (events?.Value == null) return new List<Event>();

						// Filter events by attendee
						var filteredEvents = events.Value
							.Where(e => e.Attendees?.Any(a => a.EmailAddress?.Address == attendeeEmail) == true)
							.ToList();

						return filteredEvents;
					}
					catch (Exception ex)
					{
						Console.WriteLine($"Error retrieving calendar events for user {fromUserEmail}: {ex.Message}");
						return new List<Event>();
					}
				});

				var results = await Task.WhenAll(eventTasks);
				allEvents.AddRange(results.SelectMany(r => r));

				return allEvents;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving calendar events: {ex.Message}");
				return new List<Event>();
			}
		}
	}
}
