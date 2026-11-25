const imageUrls = import.meta.glob<string>('../assets/images/*', {
  eager: true,
  import: 'default',
  query: '?url',
});

const imageUrlsByName = new Map(
  Object.entries(imageUrls).map(([path, url]) => [path.split('/').pop()!, url])
);

export const logoUrl = `${import.meta.env.BASE_URL}logo_rasanna_daeng.svg`;

export function resolveImageUrl(source: string | null | undefined): string {
  if (!source) return logoUrl;
  if (/^(https?:)?\/\//i.test(source) || /^(data|blob):/i.test(source)) return source;

  const normalizedSource = source.replace(/\\/g, '/');
  if (normalizedSource.includes('/src/assets/images/')) {
    const filename = normalizedSource.split('/').pop()?.split(/[?#]/, 1)[0];
    return (filename && imageUrlsByName.get(filename)) || logoUrl;
  }

  const normalizedPath = normalizedSource.replace(/^\/+/, '');
  if (normalizedPath === 'logo_rasanna_daeng.svg') return logoUrl;
  return normalizedSource.startsWith('/')
    ? `${import.meta.env.BASE_URL}${normalizedPath}`
    : source;
}
