export default function sitemap() {
  const baseUrl = 'https://pdf-master-rho.vercel.app/'; // REPLACE WITH YOUR URL

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/image-to-pdf`, lastModified: new Date() },
    { url: `${baseUrl}/merge-pdf`, lastModified: new Date() },
    { url: `${baseUrl}/background-remover`, lastModified: new Date() },
    { url: `${baseUrl}/voice-to-text`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
  ];
}