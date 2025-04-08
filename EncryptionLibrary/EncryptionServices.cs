using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EncryptionLibrary
{
	public class EncryptionServices
	{
		private static readonly int KeySize = 256; // AES-256
		private static readonly int BlockSize = 128; // AES Block size (always 128 bits)
		private static readonly int Iterations = 10000; // PBKDF2 iterations for key derivation
		private static readonly string Salt = "MySecureSalt12345"; // Static salt (use a securely stored value)

		public static string Encrypt(string input, string password)
		{
			var saltBytes = Encoding.UTF8.GetBytes(Salt);
			var iv = GenerateRandomBytes(16); // AES requires a 16-byte IV
			var key = DeriveKey(password, saltBytes);

			using var aes = Aes.Create();
			aes.KeySize = KeySize;
			aes.BlockSize = BlockSize;
			aes.Key = key;
			aes.IV = iv;
			aes.Mode = CipherMode.CBC;
			aes.Padding = PaddingMode.PKCS7;

			using var encryptor = aes.CreateEncryptor();
			using var ms = new MemoryStream();
			ms.Write(iv, 0, iv.Length); // Prepend IV to the encrypted data
			using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
			using (var sw = new StreamWriter(cs))
			{
				sw.Write(input);
			}
			return Convert.ToBase64String(ms.ToArray());
		}

		public static string Decrypt(string input, string password)
		{
			var encryptedBytes = Convert.FromBase64String(input);
			var saltBytes = Encoding.UTF8.GetBytes(Salt);
			var iv = new byte[16]; // IV size is 16 bytes for AES
			Array.Copy(encryptedBytes, 0, iv, 0, iv.Length);

			var cipherText = new byte[encryptedBytes.Length - iv.Length];
			Array.Copy(encryptedBytes, iv.Length, cipherText, 0, cipherText.Length);

			var key = DeriveKey(password, saltBytes);

			using var aes = Aes.Create();
			aes.KeySize = KeySize;
			aes.BlockSize = BlockSize;
			aes.Key = key;
			aes.IV = iv;
			aes.Mode = CipherMode.CBC;
			aes.Padding = PaddingMode.PKCS7;

			using var decryptor = aes.CreateDecryptor();
			using var ms = new MemoryStream(cipherText);
			using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
			using var sr = new StreamReader(cs);
			return sr.ReadToEnd();
		}

		private static byte[] GenerateRandomBytes(int length)
		{
			using var rng = new RNGCryptoServiceProvider();
			var randomBytes = new byte[length];
			rng.GetBytes(randomBytes);
			return randomBytes;
		}

		private static byte[] DeriveKey(string password, byte[] salt)
		{
			using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
			return pbkdf2.GetBytes(KeySize / 8);
		}
	}
}
