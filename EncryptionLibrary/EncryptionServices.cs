using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EncryptionLibrary
{
	using System;
	using System.IO;
	using System.Security.Cryptography;
	using System.Text;

	public class EncryptionServices
	{
		private const int KeySize = 256;
		private const int BlockSize = 128;
		private const int Iterations = 100_000;
		private const int SaltSize = 16; // 128-bit
		private const int IVSize = 16; // 128-bit
		private const int HmacSize = 32; // 256-bit (HMACSHA256)


		public static string Encrypt(string plainText)
		{
			var password = Environment.GetEnvironmentVariable("ENCRYPTION_SECRET", EnvironmentVariableTarget.User);

			var salt = GenerateRandomBytes(SaltSize);
			var iv = GenerateRandomBytes(IVSize);
			var key = DeriveKey(password, salt);

			byte[] cipherTextBytes;
			using (var aes = Aes.Create())
			{
				aes.KeySize = KeySize;
				aes.BlockSize = BlockSize;
				aes.Mode = CipherMode.CBC;
				aes.Padding = PaddingMode.PKCS7;
				aes.Key = key;
				aes.IV = iv;

				using var encryptor = aes.CreateEncryptor();
				using var ms = new MemoryStream();
				using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
				using (var sw = new StreamWriter(cs))
				{
					sw.Write(plainText);
				}
				cipherTextBytes = ms.ToArray();
			}

			// Combine all: salt + IV + ciphertext
			var combined = new byte[SaltSize + IVSize + cipherTextBytes.Length];
			Buffer.BlockCopy(salt, 0, combined, 0, SaltSize);
			Buffer.BlockCopy(iv, 0, combined, SaltSize, IVSize);
			Buffer.BlockCopy(cipherTextBytes, 0, combined, SaltSize + IVSize, cipherTextBytes.Length);

			// Generate HMAC over combined
			var hmac = ComputeHMAC(key, combined);

			// Combine final payload: [salt][iv][ciphertext][hmac]
			var finalBytes = new byte[combined.Length + hmac.Length];
			Buffer.BlockCopy(combined, 0, finalBytes, 0, combined.Length);
			Buffer.BlockCopy(hmac, 0, finalBytes, combined.Length, hmac.Length);

			return Convert.ToBase64String(finalBytes);
		}

		public static string Decrypt(string encryptedBase64)
		{
			var password = Environment.GetEnvironmentVariable("ENCRYPTION_SECRET", EnvironmentVariableTarget.User);

			var fullBytes = Convert.FromBase64String(encryptedBase64);

			if (fullBytes.Length < SaltSize + IVSize + HmacSize)
				throw new ArgumentException("Invalid encrypted data.");

			var salt = new byte[SaltSize];
			var iv = new byte[IVSize];
			var hmac = new byte[HmacSize];
			var cipherTextLength = fullBytes.Length - SaltSize - IVSize - HmacSize;
			var cipherText = new byte[cipherTextLength];

			Buffer.BlockCopy(fullBytes, 0, salt, 0, SaltSize);
			Buffer.BlockCopy(fullBytes, SaltSize, iv, 0, IVSize);
			Buffer.BlockCopy(fullBytes, SaltSize + IVSize, cipherText, 0, cipherTextLength);
			Buffer.BlockCopy(fullBytes, fullBytes.Length - HmacSize, hmac, 0, HmacSize);

			var key = DeriveKey(password, salt);

			// Validate HMAC
			var combined = new byte[SaltSize + IVSize + cipherText.Length];
			Buffer.BlockCopy(fullBytes, 0, combined, 0, combined.Length);
			var computedHmac = ComputeHMAC(key, combined);

			if (!CompareBytes(hmac, computedHmac))
				throw new CryptographicException("Invalid HMAC - data may have been tampered with.");

			// Decrypt
			using var aes = Aes.Create();
			aes.KeySize = KeySize;
			aes.BlockSize = BlockSize;
			aes.Mode = CipherMode.CBC;
			aes.Padding = PaddingMode.PKCS7;
			aes.Key = key;
			aes.IV = iv;

			using var ms = new MemoryStream(cipherText);
			using var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
			using var sr = new StreamReader(cs);
			return sr.ReadToEnd();
		}

		private static byte[] GenerateRandomBytes(int length)
		{
			var bytes = new byte[length];
			using var rng = new RNGCryptoServiceProvider();
			rng.GetBytes(bytes);
			return bytes;
		}

		private static byte[] DeriveKey(string password, byte[] salt)
		{
			using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
			return pbkdf2.GetBytes(KeySize / 8); // 32 bytes for AES-256
		}

		private static byte[] ComputeHMAC(byte[] key, byte[] data)
		{
			using var hmac = new HMACSHA256(key);
			return hmac.ComputeHash(data);
		}

		private static bool CompareBytes(byte[] a, byte[] b)
		{
			if (a.Length != b.Length) return false;
			var result = 0;
			for (int i = 0; i < a.Length; i++)
				result |= a[i] ^ b[i];
			return result == 0;
		}
	}

}
